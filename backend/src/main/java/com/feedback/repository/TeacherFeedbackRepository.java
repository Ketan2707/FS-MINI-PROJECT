package com.feedback.repository;

import com.feedback.entity.TeacherFeedback;
import com.feedback.enums.TeacherFeedbackCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherFeedbackRepository extends JpaRepository<TeacherFeedback, Long> {

    Page<TeacherFeedback> findByTeacherId(Long teacherId, Pageable pageable);

    Page<TeacherFeedback> findByStudentId(Long studentId, Pageable pageable);

    Page<TeacherFeedback> findByCategory(TeacherFeedbackCategory category, Pageable pageable);

    Page<TeacherFeedback> findByTeacherIdAndCategory(Long teacherId, TeacherFeedbackCategory category, Pageable pageable);

    @Query("SELECT AVG(tf.rating) FROM TeacherFeedback tf WHERE tf.teacher.id = :teacherId")
    Double findAverageRatingByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT COUNT(tf) FROM TeacherFeedback tf WHERE tf.teacher.id = :teacherId")
    Long countByTeacherId(@Param("teacherId") Long teacherId);

    boolean existsByStudentIdAndTeacherId(Long studentId, Long teacherId);
}
