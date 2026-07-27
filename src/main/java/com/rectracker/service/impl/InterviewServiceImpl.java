package com.rectracker.service.impl;

import com.rectracker.dao.CandidateDAO;
import com.rectracker.dao.InterviewDAO;
import com.rectracker.exception.ResourceNotFoundException;
import com.rectracker.model.Candidate;
import com.rectracker.model.Interview;
import com.rectracker.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewDAO interviewDAO;
    private final CandidateDAO candidateDAO;

    @Autowired
    public InterviewServiceImpl(InterviewDAO interviewDAO, CandidateDAO candidateDAO) {
        this.interviewDAO = interviewDAO;
        this.candidateDAO = candidateDAO;
    }

    @Override
    public Interview scheduleInterview(Interview interview) {
        Candidate candidate = candidateDAO.findById(interview.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + interview.getCandidateId()));

        if (interview.getStatus() == null || interview.getStatus().isBlank()) {
            interview.setStatus("SCHEDULED");
        }

        // Auto-update candidate status to INTERVIEWING
        candidate.setStatus("INTERVIEWING");
        candidateDAO.save(candidate);

        return interviewDAO.save(interview);
    }

    @Override
    public Interview updateInterview(Long id, Interview details) {
        Interview existing = getInterviewById(id);
        existing.setInterviewerName(details.getInterviewerName());
        existing.setRoundType(details.getRoundType());
        existing.setScheduledAt(details.getScheduledAt());
        existing.setLocationOrLink(details.getLocationOrLink());
        existing.setNotes(details.getNotes());
        if (details.getStatus() != null && !details.getStatus().isBlank()) {
            existing.setStatus(details.getStatus());
        }
        return interviewDAO.save(existing);
    }

    @Override
    public Interview updateInterviewStatus(Long id, String status) {
        Interview interview = getInterviewById(id);
        interview.setStatus(status);

        // Sync candidate status if interview status changes to PASSED / FAILED
        Candidate candidate = candidateDAO.findById(interview.getCandidateId()).orElse(null);
        if (candidate != null) {
            if ("FAILED".equalsIgnoreCase(status)) {
                candidate.setStatus("REJECTED");
                candidateDAO.save(candidate);
            }
        }

        return interviewDAO.save(interview);
    }

    @Override
    @Transactional(readOnly = true)
    public Interview getInterviewById(Long id) {
        return interviewDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Interview> getAllInterviews() {
        return interviewDAO.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Interview> getInterviewsByCandidateId(Long candidateId) {
        return interviewDAO.findByCandidateId(candidateId);
    }

    @Override
    public void deleteInterview(Long id) {
        Interview interview = getInterviewById(id);
        interviewDAO.delete(interview);
    }
}
