package com.feedback.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "rating_summary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false)
    private Double averageRating;

    @Column(nullable = false)
    private Integer totalFeedbacks;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;
}
