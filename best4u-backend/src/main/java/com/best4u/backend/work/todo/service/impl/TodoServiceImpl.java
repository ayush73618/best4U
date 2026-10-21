package com.best4u.backend.work.todo.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.security.AuthUtil;
import com.best4u.backend.work.todo.dto.TodoMapper;
import com.best4u.backend.work.todo.dto.TodoRequest;
import com.best4u.backend.work.todo.dto.TodoResponse;
import com.best4u.backend.work.todo.entity.Todo;
import com.best4u.backend.work.todo.repository.TodoRepository;
import com.best4u.backend.work.todo.service.TodoService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public List<TodoResponse> listMine() {
        return todoRepository.findByUserIdOrderByCreatedAtDesc(AuthUtil.currentUserId())
                .stream().map(TodoMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public TodoResponse create(TodoRequest request) {
        Todo todo = new Todo();
        todo.setUserId(AuthUtil.currentUserId());
        todo.setText(request.getText());
        return TodoMapper.toResponse(todoRepository.save(todo));
    }

    @Override
    @Transactional
    public TodoResponse toggle(Long id) {
        Todo todo = owned(id);
        todo.setDone(!todo.isDone());
        return TodoMapper.toResponse(todoRepository.save(todo));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        todoRepository.delete(owned(id));
    }

    @Override
    @Transactional
    public void clearCompleted() {
        todoRepository.deleteByUserIdAndDoneTrue(AuthUtil.currentUserId());
    }

    private Todo owned(Long id) {
        return todoRepository.findByIdAndUserId(id, AuthUtil.currentUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Todo not found."));
    }
}
