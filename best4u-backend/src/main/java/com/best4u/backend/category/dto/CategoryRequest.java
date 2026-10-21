// dto/CategoryRequest.java
package com.best4u.backend.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Category name is required.")
    private String name;
}