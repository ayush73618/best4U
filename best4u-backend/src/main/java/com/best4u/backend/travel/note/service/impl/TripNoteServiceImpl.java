package com.best4u.backend.travel.note.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.travel.note.dto.TripNoteMapper;
import com.best4u.backend.travel.note.dto.TripNoteRequest;
import com.best4u.backend.travel.note.dto.TripNoteResponse;
import com.best4u.backend.travel.note.entity.TripNote;
import com.best4u.backend.travel.note.repository.TripNoteRepository;
import com.best4u.backend.travel.note.service.TripNoteService;
import com.best4u.backend.travel.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TripNoteServiceImpl implements TripNoteService {

    private final TripNoteRepository tripNoteRepository;
    private final TripService tripService;

    public TripNoteServiceImpl(TripNoteRepository tripNoteRepository, TripService tripService) {
        this.tripNoteRepository = tripNoteRepository;
        this.tripService = tripService;
    }

    @Override
    public List<TripNoteResponse> listForTrip(Long tripId) {
        tripService.verifyOwnership(tripId);
        return tripNoteRepository.findByTripIdOrderByUpdatedAtDesc(tripId).stream().map(TripNoteMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public TripNoteResponse create(Long tripId, TripNoteRequest request) {
        tripService.verifyOwnership(tripId);
        TripNote note = new TripNote();
        note.setTripId(tripId);
        applyRequest(note, request);
        return TripNoteMapper.toResponse(tripNoteRepository.save(note));
    }

    @Override
    @Transactional
    public TripNoteResponse update(Long tripId, Long noteId, TripNoteRequest request) {
        tripService.verifyOwnership(tripId);
        TripNote note = owned(tripId, noteId);
        applyRequest(note, request);
        return TripNoteMapper.toResponse(tripNoteRepository.save(note));
    }

    @Override
    @Transactional
    public void delete(Long tripId, Long noteId) {
        tripService.verifyOwnership(tripId);
        tripNoteRepository.delete(owned(tripId, noteId));
    }

    private void applyRequest(TripNote note, TripNoteRequest request) {
        note.setTitle(request.getTitle() == null || request.getTitle().isBlank() ? "Untitled" : request.getTitle());
        note.setBody(request.getBody());
    }

    private TripNote owned(Long tripId, Long noteId) {
        return tripNoteRepository.findByIdAndTripId(noteId, tripId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Note not found."));
    }
}
