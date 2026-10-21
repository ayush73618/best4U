// dto/CartItemRequest.java
package com.best4u.backend.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "Product is required.")
    private Long productId;

    @Min(value = 1, message = "Quantity must be at least 1.")
    private Integer quantity;
}