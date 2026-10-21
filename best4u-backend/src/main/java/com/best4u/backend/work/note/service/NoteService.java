package com.best4u.backend.work.note.service;

import com.best4u.backend.work.note.dto.NoteRequest;
import com.best4u.backend.work.note.dto.NoteResponse;

import java.util.List;

public interface NoteService {
    List<NoteResponse> listMine();

    // One call, fully-formed content included - no more
    // "create blank, then PUT to fill it in" two-step flow.
    NoteResponse create(NoteRequest request);

    NoteResponse update(Long id, NoteRequest request);
    void delete(Long id);
}
