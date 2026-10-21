package com.best4u.backend.travel.budget.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BudgetItemResponse {
    Long id;
    String category;
    String description;
    Double amount;
}
