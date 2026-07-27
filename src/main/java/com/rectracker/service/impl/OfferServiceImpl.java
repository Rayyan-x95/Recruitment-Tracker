package com.rectracker.service.impl;

import com.rectracker.dao.CandidateDAO;
import com.rectracker.dao.OfferDAO;
import com.rectracker.exception.ResourceNotFoundException;
import com.rectracker.model.Candidate;
import com.rectracker.model.Offer;
import com.rectracker.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OfferServiceImpl implements OfferService {

    private final OfferDAO offerDAO;
    private final CandidateDAO candidateDAO;

    @Autowired
    public OfferServiceImpl(OfferDAO offerDAO, CandidateDAO candidateDAO) {
        this.offerDAO = offerDAO;
        this.candidateDAO = candidateDAO;
    }

    @Override
    public Offer createOffer(Offer offer) {
        Candidate candidate = candidateDAO.findById(offer.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + offer.getCandidateId()));

        if (offer.getStatus() == null || offer.getStatus().isBlank()) {
            offer.setStatus("PENDING");
        }

        // Set candidate status to OFFERED
        candidate.setStatus("OFFERED");
        candidateDAO.save(candidate);

        return offerDAO.save(offer);
    }

    @Override
    public Offer updateOffer(Long id, Offer offerDetails) {
        Offer existing = getOfferById(id);
        existing.setJobTitle(offerDetails.getJobTitle());
        existing.setDepartment(offerDetails.getDepartment());
        existing.setBaseSalary(offerDetails.getBaseSalary());
        existing.setJoiningDate(offerDetails.getJoiningDate());
        existing.setValidUntil(offerDetails.getValidUntil());
        if (offerDetails.getStatus() != null && !offerDetails.getStatus().isBlank()) {
            existing.setStatus(offerDetails.getStatus());
        }
        return offerDAO.save(existing);
    }

    @Override
    public Offer updateOfferStatus(Long id, String status) {
        Offer offer = getOfferById(id);
        offer.setStatus(status);

        Candidate candidate = candidateDAO.findById(offer.getCandidateId()).orElse(null);
        if (candidate != null) {
            if ("ACCEPTED".equalsIgnoreCase(status)) {
                candidate.setStatus("HIRED");
                candidateDAO.save(candidate);
            } else if ("REJECTED".equalsIgnoreCase(status)) {
                candidate.setStatus("REJECTED");
                candidateDAO.save(candidate);
            }
        }

        return offerDAO.save(offer);
    }

    @Override
    @Transactional(readOnly = true)
    public Offer getOfferById(Long id) {
        return offerDAO.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Offer> getAllOffers() {
        return offerDAO.findAll();
    }

    @Override
    public void deleteOffer(Long id) {
        Offer offer = getOfferById(id);
        offerDAO.delete(offer);
    }
}
