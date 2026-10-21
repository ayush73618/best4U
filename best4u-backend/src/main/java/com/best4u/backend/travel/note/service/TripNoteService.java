package com.best4u.backend.travel.note.service;

import com.best4u.backend.travel.note.dto.TripNoteRequest;
import com.best4u.backend.travel.note.dto.TripNoteResponse;

import java.util.List;

public interface TripNoteService {
    List<TripNoteResponse> listForTrip(Long tripId);
    TripNoteResponse create(Long tripId, TripNoteRequest request);
    TripNoteResponse update(Long tripId, Long noteId, TripNoteRequest request);
    void delete(Long tripId, Long noteId);
}
