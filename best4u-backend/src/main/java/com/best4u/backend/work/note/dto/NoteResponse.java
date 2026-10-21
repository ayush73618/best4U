package com.best4u.backend.work.note.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class NoteResponse {
    Long id;
    String title;
    String body;
    Instant updatedAt;
}
