package com.best4u.backend.travel.itinerary.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.travel.itinerary.dto.ItineraryItemRequest;
import com.best4u.backend.travel.itinerary.dto.ItineraryItemResponse;
import com.best4u.backend.travel.itinerary.service.ItineraryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travel/trips/{tripId}/itinerary")
public class ItineraryController {

    private final ItineraryService itineraryService;

    public ItineraryController(ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @GetMapping
    public Best4UResponse<List<ItineraryItemResponse>> list(@PathVariable Long tripId) {
        return Best4UResponse.ok(itineraryService.listForTrip(tripId));
    }

    @PostMapping
    public Best4UResponse<ItineraryItemResponse> create(@PathVariable Long tripId, @Valid @RequestBody ItineraryItemRequest request) {
        return Best4UResponse.ok(itineraryService.create(tripId, request));
    }

    @DeleteMapping("/{itemId}")
    public Best4UResponse<Void> delete(@PathVariable Long tripId, @PathVariable Long itemId) {
        itineraryService.delete(tripId, itemId);
        return Best4UResponse.ok(null);
    }
}
