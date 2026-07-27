package com.rectracker.service;

import com.rectracker.model.Candidate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CandidateService {
    Candidate createCandidate(Candidate candidate, MultipartFile resumeFile) throws IOException;
    Candidate updateCandidate(Long id, Candidate candidateDetails, MultipartFile resumeFile) throws IOException;
    Candidate getCandidateById(Long id);
    List<Candidate> getAllCandidates();
    List<Candidate> searchAndSortCandidates(String keyword, String status, Double minExp, String sortBy, String sortDir);
    void updateCandidateStatus(Long id, String status);
    void deleteCandidate(Long id);
}
