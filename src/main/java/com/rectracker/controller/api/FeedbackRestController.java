package com.rectracker.controller.api;

import com.rectracker.model.Feedback;
import com.rectracker.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackRestController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackRestController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks(@RequestParam(value = "candidateId", required = false) Long candidateId) {
        if (candidateId != null) {
            return ResponseEntity.ok(feedbackService.getFeedbacksByCandidateId(candidateId));
        }
        return ResponseEntity.ok(feedbackService.getAllFeedbacks());
    }

    @GetMapping("/interview/{interviewId}")
    public ResponseEntity<?> getFeedbackByInterviewId(@PathVariable("interviewId") Long interviewId) {
        Feedback feedback = feedbackService.getFeedbackByInterviewId(interviewId).orElse(null);
        if (feedback == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No feedback recorded for this interview.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(feedback);
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody Feedback feedback) {
        Feedback submitted = feedbackService.submitFeedback(feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(submitted);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable("id") Long id) {
        feedbackService.deleteFeedback(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Feedback deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
