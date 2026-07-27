package com.rectracker.controller.api;

import com.rectracker.model.Candidate;
import com.rectracker.service.CandidateService;
import com.rectracker.utility.FileStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidates")
public class CandidateRestController {

    private final CandidateService candidateService;
    private final FileStorageUtil fileStorageUtil;

    @Autowired
    public CandidateRestController(CandidateService candidateService, FileStorageUtil fileStorageUtil) {
        this.candidateService = candidateService;
        this.fileStorageUtil = fileStorageUtil;
    }

    @GetMapping
    public ResponseEntity<List<Candidate>> getCandidates(@RequestParam(value = "keyword", required = false) String keyword,
                                                         @RequestParam(value = "status", required = false) String status,
                                                         @RequestParam(value = "minExp", required = false) Double minExp,
                                                         @RequestParam(value = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
                                                         @RequestParam(value = "sortDir", required = false, defaultValue = "desc") String sortDir) {
        List<Candidate> candidates = candidateService.searchAndSortCandidates(keyword, status, minExp, sortBy, sortDir);
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable("id") Long id) {
        Candidate candidate = candidateService.getCandidateById(id);
        return ResponseEntity.ok(candidate);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> createCandidate(@RequestPart("candidate") Candidate candidate,
                                             @RequestPart(value = "resumeFile", required = false) MultipartFile resumeFile) {
        try {
            Candidate created = candidateService.createCandidate(candidate, resumeFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> updateCandidate(@PathVariable("id") Long id,
                                             @RequestPart("candidate") Candidate candidate,
                                             @RequestPart(value = "resumeFile", required = false) MultipartFile resumeFile) {
        try {
            Candidate updated = candidateService.updateCandidate(id, candidate, resumeFile);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        candidateService.updateCandidateStatus(id, status);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Candidate status updated to " + status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable("id") Long id) throws IOException {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidate(@PathVariable("id") Long id) {
        candidateService.deleteCandidate(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Candidate deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
