package com.best4u.backend.travel.itinerary.service;

import com.best4u.backend.travel.itinerary.dto.ItineraryItemRequest;
import com.best4u.backend.travel.itinerary.dto.ItineraryItemResponse;

import java.util.List;

public interface ItineraryService {
    List<ItineraryItemResponse> listForTrip(Long tripId);
    ItineraryItemResponse create(Long tripId, ItineraryItemRequest request);
    void delete(Long tripId, Long itemId);
}
