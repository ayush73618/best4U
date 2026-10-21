package com.best4u.backend.travel.note.dto;

import jakarta.validation.constraints.AssertTrue;
import lombok.Data;

@Data
public class TripNoteRequest {
    private String title;
    private String body;

    @AssertTrue(message = "A note needs a title or some content.")
    public boolean isNotEmpty() {
        return (title != null && !title.isBlank()) || (body != null && !body.isBlank());
    }
}
