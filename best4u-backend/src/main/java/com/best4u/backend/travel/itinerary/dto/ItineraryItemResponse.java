package com.best4u.backend.travel.itinerary.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ItineraryItemResponse {
    Long id;
    Integer day;
    String time;
    String title;
    String notes;
}
