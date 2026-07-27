package com.rectracker.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Candidate selection is required")
    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Candidate candidate;

    @NotBlank(message = "Interviewer name is required")
    @Column(name = "interviewer_name", nullable = false)
    private String interviewerName;

    @NotBlank(message = "Round type is required")
    @Column(name = "round_type", nullable = false)
    private String roundType; // HR, TECHNICAL_1, TECHNICAL_2, SYSTEM_DESIGN, MANAGERIAL

    @NotNull(message = "Scheduled date & time is required")
    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "location_or_link")
    private String locationOrLink;

    @Column(nullable = false)
    private String status; // SCHEDULED, COMPLETED, CANCELLED, PASSED, FAILED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Interview() {
        this.status = "SCHEDULED";
        this.createdAt = LocalDateTime.now();
    }

    public Interview(Long id, Long candidateId, String interviewerName, String roundType, 
                     LocalDateTime scheduledAt, String locationOrLink, String status, String notes) {
        this.id = id;
        this.candidateId = candidateId;
        this.interviewerName = interviewerName;
        this.roundType = roundType;
        this.scheduledAt = scheduledAt;
        this.locationOrLink = locationOrLink;
        this.status = (status != null) ? status : "SCHEDULED";
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getRoundType() {
        return roundType;
    }

    public void setRoundType(String roundType) {
        this.roundType = roundType;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getLocationOrLink() {
        return locationOrLink;
    }

    public void setLocationOrLink(String locationOrLink) {
        this.locationOrLink = locationOrLink;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
