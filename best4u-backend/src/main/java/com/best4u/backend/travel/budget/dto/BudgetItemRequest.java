package com.best4u.backend.travel.budget.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetItemRequest {
    @NotBlank(message = "Enter a category, e.g. Flights or Hotel.")
    private String category;

    private String description;

    @NotNull(message = "Enter an amount.")
    @Positive(message = "Amount must be greater than 0.")
    private Double amount;
}
