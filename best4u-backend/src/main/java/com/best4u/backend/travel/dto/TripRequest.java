package com.best4u.backend.travel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TripRequest {
    @NotBlank(message = "Trip name is required.")
    private String name;

    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;

    @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code, e.g. USD.")
    private String currency = "USD";
}
