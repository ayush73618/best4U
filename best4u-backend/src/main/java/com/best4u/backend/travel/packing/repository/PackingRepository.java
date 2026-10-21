package com.best4u.backend.travel.packing.repository;

import com.best4u.backend.travel.packing.entity.PackingItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PackingRepository extends JpaRepository<PackingItem, Long> {
    List<PackingItem> findByTripIdOrderByIdAsc(Long tripId);
    Optional<PackingItem> findByIdAndTripId(Long id, Long tripId);
}
