package com.rectracker.service.impl;

import com.rectracker.dao.CandidateDAO;
import com.rectracker.exception.ResourceNotFoundException;
import com.rectracker.exception.ValidationException;
import com.rectracker.model.Candidate;
import com.rectracker.service.CandidateService;
import com.rectracker.utility.FileStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final CandidateDAO candidateDAO;
    private final FileStorageUtil fileStorageUtil;

    @Autowired
    public CandidateServiceImpl(CandidateDAO candidateDAO, FileStorageUtil fileStorageUtil) {
        this.candidateDAO = candidateDAO;
        this.fileStorageUtil = fileStorageUtil;
    }

    @Override
    public Candidate createCandidate(Candidate candidate, MultipartFile resumeFile) throws IOException {
        if (candidateDAO.existsByEmail(candidate.getEmail())) {
            throw new ValidationException("Candidate with email '" + candidate.getEmail() + "' already exists.");
        }

        if (resumeFile != null && !resumeFile.isEmpty()) {
            String storedFileName = fileStorageUtil.storeFile(resumeFile);
            candidate.setResumeFilename(resumeFile.getOriginalFilename());
            candidate.setResumePath(storedFileName);
        }

        if (candidate.getStatus() == null || candidate.getStatus().isBlank()) {
            candidate.setStatus("APPLIED");
        }

        return candidateDAO.save(candidate);
    }

    @Override
    public Candidate updateCandidate(Long id, Candidate candidateDetails, MultipartFile resumeFile) throws IOException {
        Candidate existingCandidate = getCandidateById(id);

        existingCandidate.setFullName(candidateDetails.getFullName());
        existingCandidate.setPhone(candidateDetails.getPhone());
        existingCandidate.setSkills(candidateDetails.getSkills());
        existingCandidate.setYearsOfExperience(candidateDetails.getYearsOfExperience());
        existingCandidate.setCurrentCompany(candidateDetails.getCurrentCompany());
        existingCandidate.setTargetRole(candidateDetails.getTargetRole());
        existingCandidate.setExpectedCtc(candidateDetails.getExpectedCtc());
        
        if (candidateDetails.getStatus() != null && !candidateDetails.getStatus().isBlank()) {
            existingCandidate.setStatus(candidateDetails.getStatus());
        }

        if (resumeFile != null && !resumeFile.isEmpty()) {
            // Delete old resume if present
            if (existingCandidate.getResumePath() != null) {
                fileStorageUtil.deleteFile(existingCandidate.getResumePath());
            }
            String storedFileName = fileStorageUtil.storeFile(resumeFile);
            existingCandidate.setResumeFilename(resumeFile.getOriginalFilename());
            existingCandidate.setResumePath(storedFileName);
        }

        return candidateDAO.save(existingCandidate);
    }

    @Override
    @Transactional(readOnly = true)
    public Candidate getCandidateById(Long id) {
        return candidateDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Candidate> getAllCandidates() {
        return candidateDAO.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Candidate> searchAndSortCandidates(String keyword, String status, Double minExp, String sortBy, String sortDir) {
        // Query database with search parameters
        List<Candidate> candidates = candidateDAO.searchCandidates(
                (keyword != null && !keyword.isBlank()) ? keyword.trim() : null,
                (status != null && !status.isBlank()) ? status.trim() : null,
                minExp
        );

        // Demonstrate Collections Framework & Java Streams for dynamic sorting
        Comparator<Candidate> comparator;
        String field = (sortBy != null) ? sortBy.toLowerCase() : "createdat";

        switch (field) {
            case "name":
            case "fullname":
                comparator = Comparator.comparing(Candidate::getFullName, String.CASE_INSENSITIVE_ORDER);
                break;
            case "experience":
            case "yearsofexperience":
                comparator = Comparator.comparing(Candidate::getYearsOfExperience, Comparator.nullsFirst(Double::compareTo));
                break;
            case "status":
                comparator = Comparator.comparing(Candidate::getStatus, String.CASE_INSENSITIVE_ORDER);
                break;
            case "role":
            case "targetrole":
                comparator = Comparator.comparing(Candidate::getTargetRole, String.CASE_INSENSITIVE_ORDER);
                break;
            case "createdat":
            default:
                comparator = Comparator.comparing(Candidate::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
        }

        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }

        return candidates.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
    }

    @Override
    public void updateCandidateStatus(Long id, String status) {
        Candidate candidate = getCandidateById(id);
        candidate.setStatus(status);
        candidateDAO.save(candidate);
    }

    @Override
    public void deleteCandidate(Long id) {
        Candidate candidate = getCandidateById(id);
        if (candidate.getResumePath() != null) {
            fileStorageUtil.deleteFile(candidate.getResumePath());
        }
        candidateDAO.delete(candidate);
    }
}
