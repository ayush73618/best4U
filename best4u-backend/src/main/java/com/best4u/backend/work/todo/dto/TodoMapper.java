package com.best4u.backend.work.todo.dto;

import com.best4u.backend.work.todo.entity.Todo;

public class TodoMapper {
    private TodoMapper() {}

    public static TodoResponse toResponse(Todo todo) {
        return TodoResponse.builder().id(todo.getId()).text(todo.getText()).done(todo.isDone()).build();
    }
}
