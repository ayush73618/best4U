package com.best4u.backend.work.todo.service;

import com.best4u.backend.work.todo.dto.TodoRequest;
import com.best4u.backend.work.todo.dto.TodoResponse;

import java.util.List;

public interface TodoService {
    List<TodoResponse> listMine();
    TodoResponse create(TodoRequest request);
    TodoResponse toggle(Long id);
    void delete(Long id);
    void clearCompleted();
}
