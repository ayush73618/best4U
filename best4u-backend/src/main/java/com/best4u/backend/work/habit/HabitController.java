package com.best4u.backend.work.habit;

import com.best4u.backend.common.Best4UResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/work/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public Best4UResponse<List<Habit>> list() {
        return Best4UResponse.ok(habitService.listMine());
    }

    @PostMapping
    public Best4UResponse<Habit> create(@RequestBody Map<String, String> body) {
        return Best4UResponse.ok(habitService.create(body.get("name")));
    }

    @PutMapping("/{id}/toggle-today")
    public Best4UResponse<Habit> toggleToday(@PathVariable Long id) {
        return Best4UResponse.ok(habitService.toggleToday(id));
    }

    @DeleteMapping("/{id}")
    public Best4UResponse<Void> delete(@PathVariable Long id) {
        habitService.delete(id);
        return Best4UResponse.ok(null);
    }
}
