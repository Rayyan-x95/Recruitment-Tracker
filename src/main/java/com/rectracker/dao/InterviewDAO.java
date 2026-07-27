package com.rectracker.dao;

import com.rectracker.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewDAO extends JpaRepository<Interview, Long> {

    List<Interview> findByCandidateId(Long candidateId);

    List<Interview> findByStatus(String status);

    List<Interview> findByInterviewerNameContainingIgnoreCase(String interviewerName);

    long countByStatus(String status);
}
