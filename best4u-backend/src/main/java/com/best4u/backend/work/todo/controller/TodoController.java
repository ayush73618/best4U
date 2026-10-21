package com.best4u.backend.work.todo.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.work.todo.dto.TodoRequest;
import com.best4u.backend.work.todo.dto.TodoResponse;
import com.best4u.backend.work.todo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public Best4UResponse<List<TodoResponse>> list() {
        return Best4UResponse.ok(todoService.listMine());
    }

    @PostMapping
    public Best4UResponse<TodoResponse> create(@Valid @RequestBody TodoRequest request) {
        return Best4UResponse.ok(todoService.create(request));
    }

    @PutMapping("/{id}/toggle")
    public Best4UResponse<TodoResponse> toggle(@PathVariable Long id) {
        return Best4UResponse.ok(todoService.toggle(id));
    }

    @DeleteMapping("/{id}")
    public Best4UResponse<Void> delete(@PathVariable Long id) {
        todoService.delete(id);
        return Best4UResponse.ok(null);
    }

    @DeleteMapping("/completed")
    public Best4UResponse<Void> clearCompleted() {
        todoService.clearCompleted();
        return Best4UResponse.ok(null);
    }
}
