package com.rectracker.service.impl;

import com.rectracker.dao.CandidateDAO;
import com.rectracker.dao.InterviewDAO;
import com.rectracker.dao.OfferDAO;
import com.rectracker.model.AnalyticsSummary;
import com.rectracker.model.Candidate;
import com.rectracker.model.Interview;
import com.rectracker.model.Offer;
import com.rectracker.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final CandidateDAO candidateDAO;
    private final InterviewDAO interviewDAO;
    private final OfferDAO offerDAO;

    @Autowired
    public AnalyticsServiceImpl(CandidateDAO candidateDAO, InterviewDAO interviewDAO, OfferDAO offerDAO) {
        this.candidateDAO = candidateDAO;
        this.interviewDAO = interviewDAO;
        this.offerDAO = offerDAO;
    }

    @Override
    public AnalyticsSummary getDashboardAnalytics() {
        List<Candidate> candidates = candidateDAO.findAll();
        List<Interview> interviews = interviewDAO.findAll();
        List<Offer> offers = offerDAO.findAll();

        long totalCandidates = candidates.size();
        
        long activeInterviews = interviews.stream()
                .filter(i -> "SCHEDULED".equalsIgnoreCase(i.getStatus()))
                .count();

        long pendingOffers = offers.stream()
                .filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()))
                .count();

        long hiresCount = candidates.stream()
                .filter(c -> "HIRED".equalsIgnoreCase(c.getStatus()))
                .count();

        long totalDecidedOffers = offers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()) || "REJECTED".equalsIgnoreCase(o.getStatus()))
                .count();
        long acceptedOffers = offers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .count();

        double offerAcceptanceRate = (totalDecidedOffers > 0)
                ? ((double) acceptedOffers / totalDecidedOffers) * 100.0
                : 0.0;

        // Groupings using Collections & Java Streams
        Map<String, Long> candidatesByStatus = candidates.stream()
                .collect(Collectors.groupingBy(Candidate::getStatus, Collectors.counting()));

        Map<String, Long> offersByStatus = offers.stream()
                .collect(Collectors.groupingBy(Offer::getStatus, Collectors.counting()));

        Map<String, Long> interviewsByRound = interviews.stream()
                .collect(Collectors.groupingBy(Interview::getRoundType, Collectors.counting()));

        // Ensure default keys exist for clean UI charts
        String[] statuses = {"APPLIED", "SCREENING", "INTERVIEWING", "OFFERED", "HIRED", "REJECTED"};
        for (String s : statuses) {
            candidatesByStatus.putIfAbsent(s, 0L);
        }

        return new AnalyticsSummary(
                totalCandidates,
                activeInterviews,
                pendingOffers,
                hiresCount,
                Math.round(offerAcceptanceRate * 10.0) / 10.0,
                candidatesByStatus,
                offersByStatus,
                interviewsByRound
        );
    }
}
