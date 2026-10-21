package com.best4u.backend.order.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class OrderItemResponse {
    Long productId;
    Integer quantity;
    Double priceAtPurchase;
    String productName;
    String imageUrl;
}