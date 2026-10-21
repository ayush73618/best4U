package com.best4u.backend.travel.budget.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "budget_item")
@Getter
@Setter
@NoArgsConstructor
public class BudgetItem extends BaseEntity {

    @Column(nullable = false)
    private Long tripId;

    @Column(nullable = false)
    private String category;

    private String description;

    @Column(nullable = false)
    private Double amount;
}
