package com.best4u.backend.work.habit.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.work.habit.dto.HabitRequest;
import com.best4u.backend.work.habit.dto.HabitResponse;
import com.best4u.backend.work.habit.service.HabitService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public Best4UResponse<List<HabitResponse>> list() {
        return Best4UResponse.ok(habitService.listMine());
    }

    @PostMapping
    public Best4UResponse<HabitResponse> create(@Valid @RequestBody HabitRequest request) {
        return Best4UResponse.ok(habitService.create(request));
    }

    @PutMapping("/{id}/toggle-today")
    public Best4UResponse<HabitResponse> toggleToday(@PathVariable Long id) {
        return Best4UResponse.ok(habitService.toggleToday(id));
    }

    @DeleteMapping("/{id}")
    public Best4UResponse<Void> delete(@PathVariable Long id) {
        habitService.delete(id);
        return Best4UResponse.ok(null);
    }
}
