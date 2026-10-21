package com.best4u.backend.order.dto;

import com.best4u.backend.order.entity.Order;
import com.best4u.backend.order.entity.OrderItem;

import java.util.List;

public class OrderMapper {
    private OrderMapper() {}

    public static OrderResponse toResponse(Order order, List<OrderItem> items) {
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(items.stream().map(OrderMapper::toItemResponse).toList())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private static OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .productId(item.getProductId())
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .productName(item.getProductName())
                .imageUrl(item.getImageUrl())
                .build();
    }
}