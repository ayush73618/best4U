package com.best4u.backend.work.habit.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "habit")
@Getter
@Setter
@NoArgsConstructor
public class Habit extends BaseEntity {

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @ElementCollection
    @CollectionTable(name = "habit_completed_dates", joinColumns = @JoinColumn(name = "habit_id"))
    @Column(name = "completed_date")
    private List<String> completedDates = new ArrayList<>();
}
