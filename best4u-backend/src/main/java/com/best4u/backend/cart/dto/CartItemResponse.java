// dto/CartItemResponse.java
package com.best4u.backend.cart.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CartItemResponse {
    Long id;
    Long productId;
    String productName;
    Double unitPrice;
    Integer quantity;
    Double lineTotal;
    String imageUrl;
}