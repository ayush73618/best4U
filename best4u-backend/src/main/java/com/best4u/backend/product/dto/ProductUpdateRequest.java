package com.best4u.backend.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProductUpdateRequest {
    // Price and stock can be updated without re-review - these are
    // operational changes, not catalog content changes.
    @Positive(message = "Price must be greater than 0.")
    private Double price;

    @Min(value = 0, message = "Stock can't be negative.")
    private Integer stockQuantity;

    // Name and description changes trigger re-review because they
    // affect what shoppers see and trust about the product.
    private String name;
    private String description;
}