package com.best4u.backend.travel.note.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class TripNoteResponse {
    Long id;
    String title;
    String body;
    Instant updatedAt;
}
