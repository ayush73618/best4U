package com.best4u.backend.work.note.dto;

import com.best4u.backend.work.note.entity.Note;

public class NoteMapper {
    private NoteMapper() {}

    public static NoteResponse toResponse(Note note) {
        return NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .body(note.getBody())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}
