package com.rectracker.service.impl;

import com.rectracker.dao.FeedbackDAO;
import com.rectracker.dao.InterviewDAO;
import com.rectracker.exception.ResourceNotFoundException;
import com.rectracker.model.Feedback;
import com.rectracker.model.Interview;
import com.rectracker.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackDAO feedbackDAO;
    private final InterviewDAO interviewDAO;

    @Autowired
    public FeedbackServiceImpl(FeedbackDAO feedbackDAO, InterviewDAO interviewDAO) {
        this.feedbackDAO = feedbackDAO;
        this.interviewDAO = interviewDAO;
    }

    @Override
    public Feedback submitFeedback(Feedback feedback) {
        Interview interview = interviewDAO.findById(feedback.getInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + feedback.getInterviewId()));

        feedback.setCandidateId(interview.getCandidateId());
        
        // Auto-mark interview status as COMPLETED or PASSED/FAILED based on recommendation
        if ("NO_HIRE".equalsIgnoreCase(feedback.getOverallRecommendation())) {
            interview.setStatus("FAILED");
        } else if ("STRONG_HIRE".equalsIgnoreCase(feedback.getOverallRecommendation()) || "HIRE".equalsIgnoreCase(feedback.getOverallRecommendation())) {
            interview.setStatus("PASSED");
        } else {
            interview.setStatus("COMPLETED");
        }
        interviewDAO.save(interview);

        return feedbackDAO.save(feedback);
    }

    @Override
    @Transactional(readOnly = true)
    public Feedback getFeedbackById(Long id) {
        return feedbackDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Feedback> getFeedbackByInterviewId(Long interviewId) {
        return feedbackDAO.findByInterviewId(interviewId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getFeedbacksByCandidateId(Long candidateId) {
        return feedbackDAO.findByCandidateId(candidateId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getAllFeedbacks() {
        return feedbackDAO.findAll();
    }

    @Override
    public void deleteFeedback(Long id) {
        Feedback feedback = getFeedbackById(id);
        feedbackDAO.delete(feedback);
    }
}
