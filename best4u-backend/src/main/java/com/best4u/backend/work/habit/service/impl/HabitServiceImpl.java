package com.best4u.backend.work.habit.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.security.AuthUtil;
import com.best4u.backend.work.habit.dto.HabitMapper;
import com.best4u.backend.work.habit.dto.HabitRequest;
import com.best4u.backend.work.habit.dto.HabitResponse;
import com.best4u.backend.work.habit.entity.Habit;
import com.best4u.backend.work.habit.repository.HabitRepository;
import com.best4u.backend.work.habit.service.HabitService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitServiceImpl implements HabitService {

    private final HabitRepository habitRepository;

    public HabitServiceImpl(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    @Override
    public List<HabitResponse> listMine() {
        return habitRepository.findByUserIdOrderByCreatedAtDesc(AuthUtil.currentUserId())
                .stream().map(HabitMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public HabitResponse create(HabitRequest request) {
        Habit habit = new Habit();
        habit.setUserId(AuthUtil.currentUserId());
        habit.setName(request.getName());
        return HabitMapper.toResponse(habitRepository.save(habit));
    }

    @Override
    @Transactional
    public HabitResponse toggleToday(Long id) {
        Habit habit = owned(id);
        String today = LocalDate.now().toString();
        if (habit.getCompletedDates().contains(today)) {
            habit.getCompletedDates().remove(today);
        } else {
            habit.getCompletedDates().add(today);
        }
        return HabitMapper.toResponse(habitRepository.save(habit));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        habitRepository.delete(owned(id));
    }

    private Habit owned(Long id) {
        return habitRepository.findByIdAndUserId(id, AuthUtil.currentUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Habit not found."));
    }
}
