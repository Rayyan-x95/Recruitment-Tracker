package com.rectracker.model;

import java.util.Map;

public class AnalyticsSummary {

    private long totalCandidates;
    private long activeInterviews;
    private long pendingOffers;
    private long hiresCount;
    private double offerAcceptanceRate;
    
    private Map<String, Long> candidatesByStatus;
    private Map<String, Long> offersByStatus;
    private Map<String, Long> interviewsByRound;

    public AnalyticsSummary() {
    }

    public AnalyticsSummary(long totalCandidates, long activeInterviews, long pendingOffers, 
                            long hiresCount, double offerAcceptanceRate,
                            Map<String, Long> candidatesByStatus, Map<String, Long> offersByStatus,
                            Map<String, Long> interviewsByRound) {
        this.totalCandidates = totalCandidates;
        this.activeInterviews = activeInterviews;
        this.pendingOffers = pendingOffers;
        this.hiresCount = hiresCount;
        this.offerAcceptanceRate = offerAcceptanceRate;
        this.candidatesByStatus = candidatesByStatus;
        this.offersByStatus = offersByStatus;
        this.interviewsByRound = interviewsByRound;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(long totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public long getActiveInterviews() {
        return activeInterviews;
    }

    public void setActiveInterviews(long activeInterviews) {
        this.activeInterviews = activeInterviews;
    }

    public long getPendingOffers() {
        return pendingOffers;
    }

    public void setPendingOffers(long pendingOffers) {
        this.pendingOffers = pendingOffers;
    }

    public long getHiresCount() {
        return hiresCount;
    }

    public void setHiresCount(long hiresCount) {
        this.hiresCount = hiresCount;
    }

    public double getOfferAcceptanceRate() {
        return offerAcceptanceRate;
    }

    public void setOfferAcceptanceRate(double offerAcceptanceRate) {
        this.offerAcceptanceRate = offerAcceptanceRate;
    }

    public Map<String, Long> getCandidatesByStatus() {
        return candidatesByStatus;
    }

    public void setCandidatesByStatus(Map<String, Long> candidatesByStatus) {
        this.candidatesByStatus = candidatesByStatus;
    }

    public Map<String, Long> getOffersByStatus() {
        return offersByStatus;
    }

    public void setOffersByStatus(Map<String, Long> offersByStatus) {
        this.offersByStatus = offersByStatus;
    }

    public Map<String, Long> getInterviewsByRound() {
        return interviewsByRound;
    }

    public void setInterviewsByRound(Map<String, Long> interviewsByRound) {
        this.interviewsByRound = interviewsByRound;
    }
}
