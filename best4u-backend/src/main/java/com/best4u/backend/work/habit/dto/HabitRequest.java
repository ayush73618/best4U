package com.best4u.backend.work.habit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HabitRequest {
    @NotBlank(message = "Enter a habit name.")
    private String name;
}
