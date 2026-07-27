package com.rectracker.controller;

import com.rectracker.model.Candidate;
import com.rectracker.model.Interview;
import com.rectracker.service.CandidateService;
import com.rectracker.service.InterviewService;
import com.rectracker.utility.FileStorageUtil;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@Controller
@RequestMapping("/candidates")
public class CandidateController {

    private final CandidateService candidateService;
    private final InterviewService interviewService;
    private final FileStorageUtil fileStorageUtil;

    @Autowired
    public CandidateController(CandidateService candidateService,
                               InterviewService interviewService,
                               FileStorageUtil fileStorageUtil) {
        this.candidateService = candidateService;
        this.interviewService = interviewService;
        this.fileStorageUtil = fileStorageUtil;
    }

    @GetMapping
    public String listCandidates(@RequestParam(value = "keyword", required = false) String keyword,
                                 @RequestParam(value = "status", required = false) String status,
                                 @RequestParam(value = "minExp", required = false) Double minExp,
                                 @RequestParam(value = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
                                 @RequestParam(value = "sortDir", required = false, defaultValue = "desc") String sortDir,
                                 HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        List<Candidate> candidates = candidateService.searchAndSortCandidates(keyword, status, minExp, sortBy, sortDir);

        model.addAttribute("candidates", candidates);
        model.addAttribute("keyword", keyword);
        model.addAttribute("status", status);
        model.addAttribute("minExp", minExp);
        model.addAttribute("sortBy", sortBy);
        model.addAttribute("sortDir", sortDir);

        return "candidates/list";
    }

    @GetMapping("/new")
    public String showCreateForm(HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        model.addAttribute("candidate", new Candidate());
        return "candidates/form";
    }

    @PostMapping("/save")
    public String saveCandidate(@Valid @ModelAttribute("candidate") Candidate candidate,
                                BindingResult bindingResult,
                                @RequestParam(value = "resumeFile", required = false) MultipartFile resumeFile,
                                HttpSession session,
                                RedirectAttributes redirectAttributes,
                                Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        if (bindingResult.hasErrors()) {
            return "candidates/form";
        }

        try {
            if (candidate.getId() == null) {
                candidateService.createCandidate(candidate, resumeFile);
                redirectAttributes.addFlashAttribute("successMessage", "Candidate registered successfully!");
            } else {
                candidateService.updateCandidate(candidate.getId(), candidate, resumeFile);
                redirectAttributes.addFlashAttribute("successMessage", "Candidate updated successfully!");
            }
            return "redirect:/candidates";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error saving candidate: " + e.getMessage());
            return "candidates/form";
        }
    }

    @GetMapping("/{id}")
    public String viewCandidateDetail(@PathVariable("id") Long id, HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        Candidate candidate = candidateService.getCandidateById(id);
        List<Interview> interviews = interviewService.getInterviewsByCandidateId(id);

        model.addAttribute("candidate", candidate);
        model.addAttribute("interviews", interviews);

        return "candidates/detail";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable("id") Long id, HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        Candidate candidate = candidateService.getCandidateById(id);
        model.addAttribute("candidate", candidate);
        return "candidates/form";
    }

    @GetMapping("/{id}/resume/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable("id") Long id, HttpSession session) throws IOException {
        if (session.getAttribute("loggedUser") == null) {
            return ResponseEntity.status(401).build();
        }

        Candidate candidate = candidateService.getCandidateById(id);
        if (candidate.getResumePath() == null) {
            return ResponseEntity.notFound().build();
        }

        Path filePath = fileStorageUtil.getFilePath(candidate.getResumePath());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String filename = candidate.getResumeFilename() != null ? candidate.getResumeFilename() : "resume.pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @PostMapping("/{id}/delete")
    public String deleteCandidate(@PathVariable("id") Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        candidateService.deleteCandidate(id);
        redirectAttributes.addFlashAttribute("successMessage", "Candidate deleted successfully.");
        return "redirect:/candidates";
    }
}
