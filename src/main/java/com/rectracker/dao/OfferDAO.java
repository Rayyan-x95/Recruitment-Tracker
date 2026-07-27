package com.rectracker.dao;

import com.rectracker.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferDAO extends JpaRepository<Offer, Long> {

    Optional<Offer> findByCandidateId(Long candidateId);

    List<Offer> findByStatus(String status);

    long countByStatus(String status);
}
