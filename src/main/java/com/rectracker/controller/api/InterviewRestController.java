package com.rectracker.controller.api;

import com.rectracker.model.Interview;
import com.rectracker.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewRestController {

    private final InterviewService interviewService;

    @Autowired
    public InterviewRestController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public ResponseEntity<List<Interview>> getAllInterviews(@RequestParam(value = "candidateId", required = false) Long candidateId) {
        if (candidateId != null) {
            return ResponseEntity.ok(interviewService.getInterviewsByCandidateId(candidateId));
        }
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterviewById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @PostMapping
    public ResponseEntity<Interview> scheduleInterview(@Valid @RequestBody Interview interview) {
        Interview scheduled = interviewService.scheduleInterview(interview);
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduled);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable("id") Long id, @Valid @RequestBody Interview interview) {
        Interview updated = interviewService.updateInterview(id, interview);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Interview> updateStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Interview updated = interviewService.updateInterviewStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInterview(@PathVariable("id") Long id) {
        interviewService.deleteInterview(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Interview deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
