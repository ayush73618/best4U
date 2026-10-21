package com.best4u.backend.work.habit.dto;

import com.best4u.backend.work.habit.entity.Habit;

public class HabitMapper {
    private HabitMapper() {}

    public static HabitResponse toResponse(Habit habit) {
        return HabitResponse.builder()
                .id(habit.getId())
                .name(habit.getName())
                .completedDates(habit.getCompletedDates())
                .build();
    }
}
