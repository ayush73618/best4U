package com.best4u.backend.work.note.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.security.AuthUtil;
import com.best4u.backend.work.note.dto.NoteMapper;
import com.best4u.backend.work.note.dto.NoteRequest;
import com.best4u.backend.work.note.dto.NoteResponse;
import com.best4u.backend.work.note.entity.Note;
import com.best4u.backend.work.note.repository.NoteRepository;
import com.best4u.backend.work.note.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;

    public NoteServiceImpl(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @Override
    public List<NoteResponse> listMine() {
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(AuthUtil.currentUserId())
                .stream().map(NoteMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public NoteResponse create(NoteRequest request) {
        Note note = new Note();
        note.setUserId(AuthUtil.currentUserId());
        applyRequest(note, request);
        return NoteMapper.toResponse(noteRepository.save(note));
    }

    @Override
    @Transactional
    public NoteResponse update(Long id, NoteRequest request) {
        Note note = owned(id);
        applyRequest(note, request);
        return NoteMapper.toResponse(noteRepository.save(note));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        noteRepository.delete(owned(id));
    }

    private void applyRequest(Note note, NoteRequest request) {
        note.setTitle(request.getTitle() == null || request.getTitle().isBlank() ? "Untitled" : request.getTitle());
        note.setBody(request.getBody());
    }

    private Note owned(Long id) {
        return noteRepository.findByIdAndUserId(id, AuthUtil.currentUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Note not found."));
    }
}
