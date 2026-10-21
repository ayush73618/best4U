package com.best4u.backend.travel.packing.service;

import com.best4u.backend.travel.packing.dto.PackingItemRequest;
import com.best4u.backend.travel.packing.dto.PackingItemResponse;

import java.util.List;

public interface PackingService {
    List<PackingItemResponse> listForTrip(Long tripId);
    PackingItemResponse create(Long tripId, PackingItemRequest request);
    PackingItemResponse togglePacked(Long tripId, Long itemId);
    void delete(Long tripId, Long itemId);
}
