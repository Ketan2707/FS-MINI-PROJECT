package com.feedback.repository;

import com.feedback.entity.RatingSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingSummaryRepository extends JpaRepository<RatingSummary, Long> {

    Optional<RatingSummary> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
