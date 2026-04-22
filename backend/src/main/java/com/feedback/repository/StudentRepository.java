package com.feedback.repository;

import com.feedback.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(String rollNumber);

    Boolean existsByRollNumber(String rollNumber);

    Page<Student> findByDepartment(String department, Pageable pageable);

    Page<Student> findBySemester(Integer semester, Pageable pageable);

    Page<Student> findByDepartmentAndSemester(String department, Integer semester, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Student> searchStudents(@Param("query") String query, Pageable pageable);

    Optional<Student> findByUserId(Long userId);
}
