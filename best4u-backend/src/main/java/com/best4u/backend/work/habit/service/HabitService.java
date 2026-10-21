package com.best4u.backend.work.habit.service;

import com.best4u.backend.work.habit.dto.HabitRequest;
import com.best4u.backend.work.habit.dto.HabitResponse;

import java.util.List;

public interface HabitService {
    List<HabitResponse> listMine();
    HabitResponse create(HabitRequest request);
    HabitResponse toggleToday(Long id);
    void delete(Long id);
}
