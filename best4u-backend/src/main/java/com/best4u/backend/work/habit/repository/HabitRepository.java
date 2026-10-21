package com.best4u.backend.work.habit.repository;

import com.best4u.backend.work.habit.entity.Habit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Habit> findByIdAndUserId(Long id, Long userId);
}
