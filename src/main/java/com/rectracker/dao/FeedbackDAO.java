package com.rectracker.dao;

import com.rectracker.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackDAO extends JpaRepository<Feedback, Long> {

    List<Feedback> findByCandidateId(Long candidateId);

    Optional<Feedback> findByInterviewId(Long interviewId);
}
