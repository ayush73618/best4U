package com.best4u.backend.work.note.repository;

import com.best4u.backend.work.note.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<Note> findByIdAndUserId(Long id, Long userId);
}
