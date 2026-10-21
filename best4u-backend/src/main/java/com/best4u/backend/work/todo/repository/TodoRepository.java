package com.best4u.backend.work.todo.repository;

import com.best4u.backend.work.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Ownership pushed into the query - see the Trip audit for why this
    // replaces "findById then manually compare userId in Java".
    Optional<Todo> findByIdAndUserId(Long id, Long userId);

    // Bulk delete for "Clear completed" - one derived query replaces what
    // was previously N sequential DELETE calls from the frontend.
    void deleteByUserIdAndDoneTrue(Long userId);
}
