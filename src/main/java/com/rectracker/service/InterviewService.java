package com.rectracker.service;

import com.rectracker.model.Interview;
import java.util.List;

public interface InterviewService {
    Interview scheduleInterview(Interview interview);
    Interview updateInterview(Long id, Interview interviewDetails);
    Interview updateInterviewStatus(Long id, String status);
    Interview getInterviewById(Long id);
    List<Interview> getAllInterviews();
    List<Interview> getInterviewsByCandidateId(Long candidateId);
    void deleteInterview(Long id);
}
