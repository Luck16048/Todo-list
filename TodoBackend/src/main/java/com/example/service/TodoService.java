package com.example.service;

import com.example.entity.TodoEntity;
import com.example.repository.TodoRepository;

import java.util.List;
import java.util.Map;

public class TodoService {
    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<TodoEntity> getAll() {
        List<TodoEntity> todo = repository.findAll();
        return todo;
    }

    public TodoEntity getById(long id) {
        return repository.findById(id);
    }

    public TodoEntity add(String title) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Titlee cannot be empty");
        }
        TodoEntity todo = new TodoEntity();
        todo.setTitle(title);
        todo.setCompleted(false);
        return repository.save(todo);
    }

    public TodoEntity patch(long id, Map<String, Object> update) {
        TodoEntity todo = repository.findById(id);

        if (update.containsKey("title")) {
            todo.setTitle((String) update.get("title"));
        }

        if (update.containsKey("completed")) {
            todo.setCompleted((Boolean) update.get("completed"));
        }

        return repository.update(todo);
    }

    public void delete(long id) {
        repository.delete(id);
    }
}
