package com.best4u.backend.work.note.dto;

import jakarta.validation.constraints.AssertTrue;
import lombok.Data;

@Data
public class NoteRequest {
    private String title;
    private String body;

    // Same domain rule as TripNoteRequest: an empty note can never be
    // saved, which is what makes the frontend's "no server call until
    // Save" flow safe - there's no empty-placeholder state to clean up.
    @AssertTrue(message = "A note needs a title or some content.")
    public boolean isNotEmpty() {
        return (title != null && !title.isBlank()) || (body != null && !body.isBlank());
    }
}
