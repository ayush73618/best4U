package com.best4u.backend.travel.itinerary.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ItineraryItemRequest {
    @Min(value = 1, message = "Day must be 1 or greater.")
    private Integer day;

    private String time;

    @NotBlank(message = "Tell us what's happening at this stop.")
    private String title;

    private String notes;
}
