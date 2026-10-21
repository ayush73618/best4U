package com.best4u.backend.order.service;

import com.best4u.backend.order.dto.CheckoutResponse;
import com.best4u.backend.order.dto.OrderResponse;
import com.best4u.backend.order.dto.PaymentVerificationRequest;
import com.best4u.backend.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    CheckoutResponse checkout();
    void verifyPayment(PaymentVerificationRequest request);
    Page<OrderResponse> listMine(Pageable pageable);
    void restockAbandonedOrders();

    // Admin-only: move an order through the fulfillment state machine.
    // Only valid transitions are allowed (see impl).
    void updateStatus(Long orderId, OrderStatus newStatus);
}