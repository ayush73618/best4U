package com.best4u.backend.travel.service;

import com.best4u.backend.travel.dto.TripRequest;
import com.best4u.backend.travel.dto.TripResponse;
import com.best4u.backend.travel.entity.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TripService {
    Page<TripResponse> listMine(String keyword, Pageable pageable);
    TripResponse create(TripRequest request);
    void delete(Long tripId);

    // Called by every travel/* child service to confirm a trip belongs to
    // the caller before touching anything scoped under it.
    Trip verifyOwnership(Long tripId);
}
