package com.best4u.backend.travel.note.dto;

import com.best4u.backend.travel.note.entity.TripNote;

public class TripNoteMapper {
    private TripNoteMapper() {}

    public static TripNoteResponse toResponse(TripNote note) {
        return TripNoteResponse.builder()
                .id(note.getId()).title(note.getTitle())
                .body(note.getBody()).updatedAt(note.getUpdatedAt()).build();
    }
}
