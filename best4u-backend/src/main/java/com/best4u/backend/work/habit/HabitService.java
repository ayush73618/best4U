package com.best4u.backend.work.habit;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.security.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitService {

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    public List<Habit> listMine() {
        return habitRepository.findByUserIdOrderByCreatedAtDesc(AuthUtil.currentUserId());
    }

    public Habit create(String name) {
        Habit habit = new Habit();
        habit.setUserId(AuthUtil.currentUserId());
        habit.setName(name);
        return habitRepository.save(habit);
    }

    public Habit toggleToday(Long id) {
        Habit habit = owned(id);
        String today = LocalDate.now().toString();
        if (habit.getCompletedDates().contains(today)) {
            habit.getCompletedDates().remove(today);
        } else {
            habit.getCompletedDates().add(today);
        }
        return habitRepository.save(habit);
    }

    public void delete(Long id) {
        habitRepository.delete(owned(id));
    }

    private Habit owned(Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Habit not found."));
        if (!habit.getUserId().equals(AuthUtil.currentUserId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not your habit.");
        }
        return habit;
    }
}
