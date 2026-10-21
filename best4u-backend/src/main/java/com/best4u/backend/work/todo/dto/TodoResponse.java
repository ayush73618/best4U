package com.best4u.backend.work.todo.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TodoResponse {
    Long id;
    String text;
    boolean done;
}
