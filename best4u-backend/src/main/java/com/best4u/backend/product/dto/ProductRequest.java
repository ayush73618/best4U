package com.best4u.backend.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required.")
    private String name;

    private String description;

    @NotNull(message = "Price is required.")
    @Positive(message = "Price must be greater than 0.")
    private Double price;

    @NotNull(message = "Category is required.")
    private Long categoryId;

    @NotNull(message = "Stock quantity is required.")
    @Min(value = 0, message = "Stock can't be negative.")
    private Integer stockQuantity;
}