package com.best4u.backend.travel.budget.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.travel.budget.dto.BudgetItemRequest;
import com.best4u.backend.travel.budget.dto.BudgetItemResponse;
import com.best4u.backend.travel.budget.dto.BudgetMapper;
import com.best4u.backend.travel.budget.entity.BudgetItem;
import com.best4u.backend.travel.budget.repository.BudgetRepository;
import com.best4u.backend.travel.budget.service.BudgetService;
import com.best4u.backend.travel.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final TripService tripService;

    public BudgetServiceImpl(BudgetRepository budgetRepository, TripService tripService) {
        this.budgetRepository = budgetRepository;
        this.tripService = tripService;
    }

    @Override
    public List<BudgetItemResponse> listForTrip(Long tripId) {
        tripService.verifyOwnership(tripId);
        return budgetRepository.findByTripIdOrderByIdDesc(tripId).stream().map(BudgetMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public BudgetItemResponse create(Long tripId, BudgetItemRequest request) {
        tripService.verifyOwnership(tripId);
        BudgetItem item = BudgetMapper.toEntity(request);
        item.setTripId(tripId);
        return BudgetMapper.toResponse(budgetRepository.save(item));
    }

    @Override
    @Transactional
    public void delete(Long tripId, Long itemId) {
        tripService.verifyOwnership(tripId);
        BudgetItem item = budgetRepository.findByIdAndTripId(itemId, tripId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Budget item not found."));
        budgetRepository.delete(item);
    }
}
