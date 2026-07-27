package com.rectracker.controller;

import com.rectracker.model.Feedback;
import com.rectracker.model.Interview;
import com.rectracker.service.FeedbackService;
import com.rectracker.service.InterviewService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final InterviewService interviewService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService, InterviewService interviewService) {
        this.feedbackService = feedbackService;
        this.interviewService = interviewService;
    }

    @GetMapping
    public String listFeedbacks(HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        List<Feedback> feedbacks = feedbackService.getAllFeedbacks();
        model.addAttribute("feedbacks", feedbacks);
        return "feedbacks/list";
    }

    @GetMapping("/new")
    public String showFeedbackForm(@RequestParam("interviewId") Long interviewId, HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        Interview interview = interviewService.getInterviewById(interviewId);
        Feedback feedback = new Feedback();
        feedback.setInterviewId(interviewId);
        feedback.setCandidateId(interview.getCandidateId());
        feedback.setInterviewerName(interview.getInterviewerName());

        model.addAttribute("feedback", feedback);
        model.addAttribute("interview", interview);

        return "feedbacks/form";
    }

    @PostMapping("/save")
    public String saveFeedback(@Valid @ModelAttribute("feedback") Feedback feedback,
                               BindingResult bindingResult,
                               HttpSession session,
                               RedirectAttributes redirectAttributes,
                               Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            Interview interview = interviewService.getInterviewById(feedback.getInterviewId());
            model.addAttribute("interview", interview);
            return "feedbacks/form";
        }

        feedbackService.submitFeedback(feedback);
        redirectAttributes.addFlashAttribute("successMessage", "Interview feedback submitted successfully!");
        return "redirect:/interviews";
    }

    @GetMapping("/interview/{interviewId}")
    public String viewFeedbackForInterview(@PathVariable("interviewId") Long interviewId, HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        Feedback feedback = feedbackService.getFeedbackByInterviewId(interviewId)
                .orElse(null);

        model.addAttribute("feedback", feedback);
        model.addAttribute("interviewId", interviewId);

        return "feedbacks/detail";
    }
}
