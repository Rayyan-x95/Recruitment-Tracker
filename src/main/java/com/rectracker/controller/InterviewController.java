package com.rectracker.controller;

import com.rectracker.model.Candidate;
import com.rectracker.model.Interview;
import com.rectracker.service.CandidateService;
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
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final CandidateService candidateService;

    @Autowired
    public InterviewController(InterviewService interviewService, CandidateService candidateService) {
        this.interviewService = interviewService;
        this.candidateService = candidateService;
    }

    @GetMapping
    public String listInterviews(HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        List<Interview> interviews = interviewService.getAllInterviews();
        model.addAttribute("interviews", interviews);
        return "interviews/list";
    }

    @GetMapping("/new")
    public String showScheduleForm(@RequestParam(value = "candidateId", required = false) Long candidateId,
                                   HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        Interview interview = new Interview();
        if (candidateId != null) {
            interview.setCandidateId(candidateId);
        }

        List<Candidate> candidates = candidateService.getAllCandidates();
        model.addAttribute("interview", interview);
        model.addAttribute("candidates", candidates);

        return "interviews/form";
    }

    @PostMapping("/save")
    public String saveInterview(@Valid @ModelAttribute("interview") Interview interview,
                                BindingResult bindingResult,
                                HttpSession session,
                                RedirectAttributes redirectAttributes,
                                Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            model.addAttribute("candidates", candidateService.getAllCandidates());
            return "interviews/form";
        }

        if (interview.getId() == null) {
            interviewService.scheduleInterview(interview);
            redirectAttributes.addFlashAttribute("successMessage", "Interview scheduled successfully!");
        } else {
            interviewService.updateInterview(interview.getId(), interview);
            redirectAttributes.addFlashAttribute("successMessage", "Interview updated successfully!");
        }

        return "redirect:/interviews";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable("id") Long id, HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        Interview interview = interviewService.getInterviewById(id);
        model.addAttribute("interview", interview);
        model.addAttribute("candidates", candidateService.getAllCandidates());
        return "interviews/form";
    }

    @PostMapping("/{id}/status")
    public String updateStatus(@PathVariable("id") Long id,
                               @RequestParam("status") String status,
                               HttpSession session,
                               RedirectAttributes redirectAttributes) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        interviewService.updateInterviewStatus(id, status);
        redirectAttributes.addFlashAttribute("successMessage", "Interview status updated to " + status);
        return "redirect:/interviews";
    }

    @PostMapping("/{id}/delete")
    public String deleteInterview(@PathVariable("id") Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        interviewService.deleteInterview(id);
        redirectAttributes.addFlashAttribute("successMessage", "Interview cancelled/deleted.");
        return "redirect:/interviews";
    }
}
