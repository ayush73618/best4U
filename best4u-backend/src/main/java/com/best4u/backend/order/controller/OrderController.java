package com.best4u.backend.order.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.order.dto.CheckoutResponse;
import com.best4u.backend.order.dto.OrderResponse;
import com.best4u.backend.order.dto.PaymentVerificationRequest;
import com.best4u.backend.order.entity.OrderStatus;
import com.best4u.backend.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public Best4UResponse<CheckoutResponse> checkout() {
        return Best4UResponse.ok(orderService.checkout());
    }

    @PostMapping("/verify-payment")
    public Best4UResponse<Void> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request) {
        orderService.verifyPayment(request);
        return Best4UResponse.ok(null);
    }

    @GetMapping
    public Best4UResponse<Page<OrderResponse>> list(
            @PageableDefault(size = 10) Pageable pageable) {
        return Best4UResponse.ok(orderService.listMine(pageable));
    }
}