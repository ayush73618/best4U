package com.best4u.backend.travel.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.time.LocalDate;

@Value
@Builder
public class TripResponse {
    Long id;
    String name;
    String destination;
    LocalDate startDate;
    LocalDate endDate;
    String currency;
    Instant createdAt;
}
