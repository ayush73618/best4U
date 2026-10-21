package com.best4u.backend.travel.packing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PackingItemRequest {
    @NotBlank(message = "Enter an item to pack.")
    private String text;
}
