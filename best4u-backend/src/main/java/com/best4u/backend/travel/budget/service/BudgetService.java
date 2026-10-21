package com.best4u.backend.travel.budget.service;

import com.best4u.backend.travel.budget.dto.BudgetItemRequest;
import com.best4u.backend.travel.budget.dto.BudgetItemResponse;

import java.util.List;

public interface BudgetService {
    List<BudgetItemResponse> listForTrip(Long tripId);
    BudgetItemResponse create(Long tripId, BudgetItemRequest request);
    void delete(Long tripId, Long itemId);
}
