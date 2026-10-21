package com.best4u.backend.travel.budget.dto;

import com.best4u.backend.travel.budget.entity.BudgetItem;

public class BudgetMapper {
    private BudgetMapper() {}

    public static BudgetItemResponse toResponse(BudgetItem item) {
        return BudgetItemResponse.builder()
                .id(item.getId()).category(item.getCategory())
                .description(item.getDescription()).amount(item.getAmount()).build();
    }

    public static BudgetItem toEntity(BudgetItemRequest request) {
        BudgetItem item = new BudgetItem();
        item.setCategory(request.getCategory());
        item.setDescription(request.getDescription());
        item.setAmount(request.getAmount());
        return item;
    }
}
