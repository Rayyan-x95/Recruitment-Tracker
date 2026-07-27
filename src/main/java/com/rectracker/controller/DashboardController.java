package com.rectracker.controller;

import com.rectracker.model.AnalyticsSummary;
import com.rectracker.model.Candidate;
import com.rectracker.model.Interview;
import com.rectracker.service.AnalyticsService;
import com.rectracker.service.CandidateService;
import com.rectracker.service.InterviewService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class DashboardController {

    private final AnalyticsService analyticsService;
    private final CandidateService candidateService;
    private final InterviewService interviewService;

    @Autowired
    public DashboardController(AnalyticsService analyticsService,
                               CandidateService candidateService,
                               InterviewService interviewService) {
        this.analyticsService = analyticsService;
        this.candidateService = candidateService;
        this.interviewService = interviewService;
    }

    @GetMapping({"/", "/dashboard"})
    public String dashboard(HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        AnalyticsSummary analytics = analyticsService.getDashboardAnalytics();
        List<Candidate> recentCandidates = candidateService.getAllCandidates().stream()
                .limit(5)
                .toList();

        List<Interview> upcomingInterviews = interviewService.getAllInterviews().stream()
                .filter(i -> "SCHEDULED".equalsIgnoreCase(i.getStatus()))
                .limit(5)
                .toList();

        model.addAttribute("analytics", analytics);
        model.addAttribute("recentCandidates", recentCandidates);
        model.addAttribute("upcomingInterviews", upcomingInterviews);

        return "dashboard/index";
    }
}
