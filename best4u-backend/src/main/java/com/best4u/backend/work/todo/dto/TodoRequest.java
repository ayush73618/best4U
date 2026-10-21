package com.best4u.backend.work.todo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TodoRequest {
    @NotBlank(message = "Enter a task.")
    private String text;
}
