package com.best4u.backend.work.note;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.security.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> listMine() {
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(AuthUtil.currentUserId());
    }

    public Note create() {
        Note note = new Note();
        note.setUserId(AuthUtil.currentUserId());
        note.setTitle("");
        note.setBody("");
        return noteRepository.save(note);
    }

    public Note save(Long id, String title, String body) {
        Note note = owned(id);
        note.setTitle(title == null || title.isBlank() ? "Untitled" : title);
        note.setBody(body);
        note.setUpdatedAt(Instant.now());
        return noteRepository.save(note);
    }

    public void delete(Long id) {
        noteRepository.delete(owned(id));
    }

    private Note owned(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Note not found."));
        if (!note.getUserId().equals(AuthUtil.currentUserId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not your note.");
        }
        return note;
    }
}
