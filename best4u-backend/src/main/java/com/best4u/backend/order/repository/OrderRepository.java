package com.best4u.backend.order.repository;

import com.best4u.backend.order.entity.Order;
import com.best4u.backend.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    // Finds orders that have sat in a given status since before the cutoff -
    // used to find PENDING orders old enough to assume abandoned.
    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, Instant cutoff);
}