package com.best4u.backend.work.todo;

import com.best4u.backend.common.Best4UResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/work/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public Best4UResponse<List<Todo>> list() {
        return Best4UResponse.ok(todoService.listMine());
    }

    @PostMapping
    public Best4UResponse<Todo> create(@RequestBody Map<String, String> body) {
        return Best4UResponse.ok(todoService.create(body.get("text")));
    }

    @PutMapping("/{id}/toggle")
    public Best4UResponse<Todo> toggle(@PathVariable Long id) {
        return Best4UResponse.ok(todoService.toggle(id));
    }

    @DeleteMapping("/{id}")
    public Best4UResponse<Void> delete(@PathVariable Long id) {
        todoService.delete(id);
        return Best4UResponse.ok(null);
    }
}
