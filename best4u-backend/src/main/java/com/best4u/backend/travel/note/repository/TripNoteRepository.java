package com.best4u.backend.travel.note.repository;

import com.best4u.backend.travel.note.entity.TripNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripNoteRepository extends JpaRepository<TripNote, Long> {
    List<TripNote> findByTripIdOrderByUpdatedAtDesc(Long tripId);
    Optional<TripNote> findByIdAndTripId(Long id, Long tripId);
}
