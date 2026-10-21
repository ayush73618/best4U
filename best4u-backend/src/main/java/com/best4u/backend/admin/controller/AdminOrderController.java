package com.best4u.backend.admin.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.order.entity.OrderStatus;
import com.best4u.backend.order.service.OrderService;
import org.springframework.web.bind.annotation.*;

// All /admin/** routes are already secured to ROLE_ADMIN in SecurityConfig.
@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PutMapping("/{id}/ship")
    public Best4UResponse<Void> ship(@PathVariable Long id) {
        orderService.updateStatus(id, OrderStatus.SHIPPED);
        return Best4UResponse.ok("Order marked as shipped.", null);
    }

    @PutMapping("/{id}/deliver")
    public Best4UResponse<Void> deliver(@PathVariable Long id) {
        orderService.updateStatus(id, OrderStatus.DELIVERED);
        return Best4UResponse.ok("Order marked as delivered.", null);
    }
}