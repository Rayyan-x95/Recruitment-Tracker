package com.rectracker.service;

import com.rectracker.model.Feedback;
import java.util.List;
import java.util.Optional;

public interface FeedbackService {
    Feedback submitFeedback(Feedback feedback);
    Feedback getFeedbackById(Long id);
    Optional<Feedback> getFeedbackByInterviewId(Long interviewId);
    List<Feedback> getFeedbacksByCandidateId(Long candidateId);
    List<Feedback> getAllFeedbacks();
    void deleteFeedback(Long id);
}
