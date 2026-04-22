package com.feedback.repository;

import com.feedback.entity.Feedback;
import com.feedback.enums.FeedbackCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    Page<Feedback> findByStudentId(Long studentId, Pageable pageable);

    Page<Feedback> findBySubjectId(Long subjectId, Pageable pageable);

    Page<Feedback> findByStudentIdAndSubjectId(Long studentId, Long subjectId, Pageable pageable);

    Page<Feedback> findByCategory(FeedbackCategory category, Pageable pageable);

    Page<Feedback> findBySubmittedById(Long userId, Pageable pageable);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.student.id = :studentId")
    Double findAverageRatingByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.student.id = :studentId")
    Long countByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double findOverallAverageRating();

    @Query("SELECT f.rating, COUNT(f) FROM Feedback f GROUP BY f.rating ORDER BY f.rating")
    List<Object[]> findRatingDistribution();

    @Query("SELECT f.category, COUNT(f) FROM Feedback f GROUP BY f.category")
    List<Object[]> findCategoryBreakdown();

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.createdAt >= :since")
    Long countFeedbacksSince(@Param("since") LocalDateTime since);

    @Query("SELECT f.student.id, f.student.firstName, f.student.lastName, AVG(f.rating) as avgRating, COUNT(f) as feedbackCount " +
           "FROM Feedback f GROUP BY f.student.id, f.student.firstName, f.student.lastName " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedStudents(Pageable pageable);
}
