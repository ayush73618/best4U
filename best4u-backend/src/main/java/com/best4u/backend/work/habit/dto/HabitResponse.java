package com.best4u.backend.work.habit.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class HabitResponse {
    Long id;
    String name;
    List<String> completedDates;
}
