package com.best4u.backend.work.note;

import com.best4u.backend.common.Best4UResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/work/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public Best4UResponse<List<Note>> list() {
        return Best4UResponse.ok(noteService.listMine());
    }

    @PostMapping
    public Best4UResponse<Note> create() {
        return Best4UResponse.ok(noteService.create());
    }

    @PutMapping("/{id}")
    public Best4UResponse<Note> save(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return Best4UResponse.ok(noteService.save(id, body.get("title"), body.get("body")));
    }

    @DeleteMapping("/{id}")
    public Best4UResponse<Void> delete(@PathVariable Long id) {
        noteService.delete(id);
        return Best4UResponse.ok(null);
    }
}
