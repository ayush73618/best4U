package com.best4u.backend.travel.budget.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.travel.budget.dto.BudgetItemRequest;
import com.best4u.backend.travel.budget.dto.BudgetItemResponse;
import com.best4u.backend.travel.budget.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travel/trips/{tripId}/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public Best4UResponse<List<BudgetItemResponse>> list(@PathVariable Long tripId) {
        return Best4UResponse.ok(budgetService.listForTrip(tripId));
    }

    @PostMapping
    public Best4UResponse<BudgetItemResponse> create(@PathVariable Long tripId, @Valid @RequestBody BudgetItemRequest request) {
        return Best4UResponse.ok(budgetService.create(tripId, request));
    }

    @DeleteMapping("/{itemId}")
    public Best4UResponse<Void> delete(@PathVariable Long tripId, @PathVariable Long itemId) {
        budgetService.delete(tripId, itemId);
        return Best4UResponse.ok(null);
    }
}
