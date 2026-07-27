package com.rectracker.service;

import com.rectracker.model.Offer;
import java.util.List;

public interface OfferService {
    Offer createOffer(Offer offer);
    Offer updateOffer(Long id, Offer offerDetails);
    Offer updateOfferStatus(Long id, String status);
    Offer getOfferById(Long id);
    List<Offer> getAllOffers();
    void deleteOffer(Long id);
}
