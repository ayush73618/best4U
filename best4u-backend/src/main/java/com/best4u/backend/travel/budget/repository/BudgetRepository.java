package com.best4u.backend.travel.budget.repository;

import com.best4u.backend.travel.budget.entity.BudgetItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<BudgetItem, Long> {
    List<BudgetItem> findByTripIdOrderByIdDesc(Long tripId);
    Optional<BudgetItem> findByIdAndTripId(Long id, Long tripId);
}
