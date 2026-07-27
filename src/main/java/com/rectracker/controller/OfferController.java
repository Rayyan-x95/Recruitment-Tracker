package com.rectracker.controller;

import com.rectracker.model.Candidate;
import com.rectracker.model.Offer;
import com.rectracker.service.CandidateService;
import com.rectracker.service.OfferService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/offers")
public class OfferController {

    private final OfferService offerService;
    private final CandidateService candidateService;

    @Autowired
    public OfferController(OfferService offerService, CandidateService candidateService) {
        this.offerService = offerService;
        this.candidateService = candidateService;
    }

    @GetMapping
    public String listOffers(HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        List<Offer> offers = offerService.getAllOffers();
        model.addAttribute("offers", offers);
        return "offers/list";
    }

    @GetMapping("/new")
    public String showCreateOfferForm(@RequestParam(value = "candidateId", required = false) Long candidateId,
                                      HttpSession session, Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        Offer offer = new Offer();
        if (candidateId != null) {
            offer.setCandidateId(candidateId);
            Candidate candidate = candidateService.getCandidateById(candidateId);
            offer.setJobTitle(candidate.getTargetRole());
            if (candidate.getExpectedCtc() != null) {
                offer.setBaseSalary(candidate.getExpectedCtc());
            }
        }

        List<Candidate> candidates = candidateService.getAllCandidates();
        model.addAttribute("offer", offer);
        model.addAttribute("candidates", candidates);

        return "offers/form";
    }

    @PostMapping("/save")
    public String saveOffer(@Valid @ModelAttribute("offer") Offer offer,
                            BindingResult bindingResult,
                            HttpSession session,
                            RedirectAttributes redirectAttributes,
                            Model model) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        if (bindingResult.hasErrors()) {
            model.addAttribute("candidates", candidateService.getAllCandidates());
            return "offers/form";
        }

        if (offer.getId() == null) {
            offerService.createOffer(offer);
            redirectAttributes.addFlashAttribute("successMessage", "Job Offer generated and candidate notified!");
        } else {
            offerService.updateOffer(offer.getId(), offer);
            redirectAttributes.addFlashAttribute("successMessage", "Job Offer details updated successfully!");
        }

        return "redirect:/offers";
    }

    @PostMapping("/{id}/status")
    public String updateOfferStatus(@PathVariable("id") Long id,
                                    @RequestParam("status") String status,
                                    HttpSession session,
                                    RedirectAttributes redirectAttributes) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }

        offerService.updateOfferStatus(id, status);
        redirectAttributes.addFlashAttribute("successMessage", "Offer status updated to " + status);
        return "redirect:/offers";
    }

    @PostMapping("/{id}/delete")
    public String deleteOffer(@PathVariable("id") Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("loggedUser") == null) {
            return "redirect:/login";
        }
        offerService.deleteOffer(id);
        redirectAttributes.addFlashAttribute("successMessage", "Offer deleted.");
        return "redirect:/offers";
    }
}
