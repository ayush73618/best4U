package com.best4u.backend.travel.itinerary.repository;

import com.best4u.backend.travel.itinerary.entity.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItineraryRepository extends JpaRepository<ItineraryItem, Long> {
    List<ItineraryItem> findByTripIdOrderByDayAscTimeAsc(Long tripId);
    Optional<ItineraryItem> findByIdAndTripId(Long id, Long tripId);
}
