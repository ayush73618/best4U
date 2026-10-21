package com.best4u.backend.travel.note.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.travel.note.dto.TripNoteRequest;
import com.best4u.backend.travel.note.dto.TripNoteResponse;
import com.best4u.backend.travel.note.service.TripNoteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travel/trips/{tripId}/notes")
public class TripNoteController {

    private final TripNoteService tripNoteService;

    public TripNoteController(TripNoteService tripNoteService) {
        this.tripNoteService = tripNoteService;
    }

    @GetMapping
    public Best4UResponse<List<TripNoteResponse>> list(@PathVariable Long tripId) {
        return Best4UResponse.ok(tripNoteService.listForTrip(tripId));
    }

    @PostMapping
    public Best4UResponse<TripNoteResponse> create(@PathVariable Long tripId, @Valid @RequestBody TripNoteRequest request) {
        return Best4UResponse.ok(tripNoteService.create(tripId, request));
    }

    @PutMapping("/{noteId}")
    public Best4UResponse<TripNoteResponse> update(@PathVariable Long tripId, @PathVariable Long noteId, @Valid @RequestBody TripNoteRequest request) {
        return Best4UResponse.ok(tripNoteService.update(tripId, noteId, request));
    }

    @DeleteMapping("/{noteId}")
    public Best4UResponse<Void> delete(@PathVariable Long tripId, @PathVariable Long noteId) {
        tripNoteService.delete(tripId, noteId);
        return Best4UResponse.ok(null);
    }
}
