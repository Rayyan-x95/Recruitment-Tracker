package com.rectracker.controller.api;

import com.rectracker.model.Offer;
import com.rectracker.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offers")
public class OfferRestController {

    private final OfferService offerService;

    @Autowired
    public OfferRestController(OfferService offerService) {
        this.offerService = offerService;
    }

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOfferById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }

    @PostMapping
    public ResponseEntity<Offer> createOffer(@Valid @RequestBody Offer offer) {
        Offer created = offerService.createOffer(offer);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Offer> updateOffer(@PathVariable("id") Long id, @Valid @RequestBody Offer offer) {
        Offer updated = offerService.updateOffer(id, offer);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Offer> updateStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Offer updated = offerService.updateOfferStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable("id") Long id) {
        offerService.deleteOffer(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Offer deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
