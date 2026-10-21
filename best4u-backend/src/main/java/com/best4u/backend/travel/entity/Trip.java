package com.best4u.backend.travel.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "trip")
@Getter
@Setter
@NoArgsConstructor
public class Trip extends BaseEntity {

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;

    @Column(nullable = false)
    private String currency = "USD";
}
