package com.best4u.backend.work.note.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.work.note.dto.NoteRequest;
import com.best4u.backend.work.note.dto.NoteResponse;
import com.best4u.backend.work.note.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public Best4UResponse<List<NoteResponse>> list() {
        return Best4UResponse.ok(noteService.listMine());
    }

    @PostMapping
    public Best4UResponse<NoteResponse> create(@Valid @RequestBody NoteRequest request) {
        return Best4UResponse.ok(noteService.create(request));
    }

    @PutMapping("/{id}")
    public Best4UResponse<NoteResponse> update(@PathVariable Long id, @Valid @RequestBody NoteRequest request) {
        return Best4UResponse.ok(noteService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public Best4UResponse<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return Best4UResponse.ok(null);
    }
}
