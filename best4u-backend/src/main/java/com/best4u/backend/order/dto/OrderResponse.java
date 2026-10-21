package com.best4u.backend.order.dto;

import com.best4u.backend.order.entity.OrderStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class OrderResponse {
    Long id;
    OrderStatus status;
    Double totalAmount;
    List<OrderItemResponse> items;
    Instant createdAt;
}