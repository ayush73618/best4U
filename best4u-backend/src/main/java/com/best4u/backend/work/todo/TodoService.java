package com.best4u.backend.work.todo;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.security.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> listMine() {
        return todoRepository.findByUserIdOrderByCreatedAtDesc(AuthUtil.currentUserId());
    }

    public Todo create(String text) {
        Todo todo = new Todo();
        todo.setUserId(AuthUtil.currentUserId());
        todo.setText(text);
        return todoRepository.save(todo);
    }

    public Todo toggle(Long id) {
        Todo todo = owned(id);
        todo.setDone(!todo.isDone());
        return todoRepository.save(todo);
    }

    public void delete(Long id) {
        todoRepository.delete(owned(id));
    }

    // Ensures a user can only touch their own todos, even if they guess
    // another user's ID in the URL.
    private Todo owned(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Todo not found."));
        if (!todo.getUserId().equals(AuthUtil.currentUserId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not your todo.");
        }
        return todo;
    }
}
