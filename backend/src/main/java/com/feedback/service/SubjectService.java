package com.feedback.service;

import com.feedback.entity.Subject;
import com.feedback.exception.DuplicateResourceException;
import com.feedback.exception.ResourceNotFoundException;
import com.feedback.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
    }

    public Subject createSubject(Subject subject) {
        if (subjectRepository.existsByCode(subject.getCode())) {
            throw new DuplicateResourceException("Subject", "code", subject.getCode());
        }
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(Long id, Subject request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));

        subject.setName(request.getName());
        subject.setCode(request.getCode());
        subject.setDepartment(request.getDepartment());
        subject.setSemester(request.getSemester());
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject", "id", id);
        }
        subjectRepository.deleteById(id);
    }

    public List<Subject> getSubjectsByDepartment(String department) {
        return subjectRepository.findByDepartment(department);
    }
}
