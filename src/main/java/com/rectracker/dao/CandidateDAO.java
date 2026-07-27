package com.rectracker.dao;

import com.rectracker.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateDAO extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Candidate> findByStatus(String status);

    @Query("SELECT c FROM Candidate c WHERE " +
           "(:keyword IS NULL OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.skills) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.targetRole) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR :status = '' OR c.status = :status) AND " +
           "(:minExperience IS NULL OR c.yearsOfExperience >= :minExperience)")
    List<Candidate> searchCandidates(@Param("keyword") String keyword, 
                                     @Param("status") String status, 
                                     @Param("minExperience") Double minExperience);

    long countByStatus(String status);
}
