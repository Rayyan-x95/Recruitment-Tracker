package com.rectracker.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Interview selection is required")
    @Column(name = "interview_id", nullable = false)
    private Long interviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Interview interview;

    @NotNull(message = "Candidate ID is required")
    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Candidate candidate;

    @NotBlank(message = "Interviewer name is required")
    @Column(name = "interviewer_name", nullable = false)
    private String interviewerName;

    @Min(1) @Max(5)
    @Column(name = "technical_rating", nullable = false)
    private Integer technicalRating;

    @Min(1) @Max(5)
    @Column(name = "communication_rating", nullable = false)
    private Integer communicationRating;

    @Min(1) @Max(5)
    @Column(name = "problem_solving_rating", nullable = false)
    private Integer problemSolvingRating;

    @NotBlank(message = "Overall recommendation is required")
    @Column(name = "overall_recommendation", nullable = false)
    private String overallRecommendation; // STRONG_HIRE, HIRE, HOLD, NO_HIRE

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }

    public Feedback(Long id, Long interviewId, Long candidateId, String interviewerName, 
                    Integer technicalRating, Integer communicationRating, Integer problemSolvingRating, 
                    String overallRecommendation, String comments) {
        this.id = id;
        this.interviewId = interviewId;
        this.candidateId = candidateId;
        this.interviewerName = interviewerName;
        this.technicalRating = technicalRating;
        this.communicationRating = communicationRating;
        this.problemSolvingRating = problemSolvingRating;
        this.overallRecommendation = overallRecommendation;
        this.comments = comments;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Double getAverageScore() {
        if (technicalRating == null || communicationRating == null || problemSolvingRating == null) {
            return 0.0;
        }
        return (technicalRating + communicationRating + problemSolvingRating) / 3.0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public Interview getInterview() {
        return interview;
    }

    public void setInterview(Interview interview) {
        this.interview = interview;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public String getInterviewerName() {
        return interviewerName;
    }

    public void setInterviewerName(String interviewerName) {
        this.interviewerName = interviewerName;
    }

    public Integer getTechnicalRating() {
        return technicalRating;
    }

    public void setTechnicalRating(Integer technicalRating) {
        this.technicalRating = technicalRating;
    }

    public Integer getCommunicationRating() {
        return communicationRating;
    }

    public void setCommunicationRating(Integer communicationRating) {
        this.communicationRating = communicationRating;
    }

    public Integer getProblemSolvingRating() {
        return problemSolvingRating;
    }

    public void setProblemSolvingRating(Integer problemSolvingRating) {
        this.problemSolvingRating = problemSolvingRating;
    }

    public String getOverallRecommendation() {
        return overallRecommendation;
    }

    public void setOverallRecommendation(String overallRecommendation) {
        this.overallRecommendation = overallRecommendation;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
