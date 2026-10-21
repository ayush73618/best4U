package com.best4u.backend.travel.repository;

import com.best4u.backend.travel.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long>, JpaSpecificationExecutor<Trip> {
    Optional<Trip> findByIdAndUserId(Long id, Long userId);
}
