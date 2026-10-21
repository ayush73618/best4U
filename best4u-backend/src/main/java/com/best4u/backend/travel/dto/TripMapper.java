package com.best4u.backend.travel.dto;

import com.best4u.backend.travel.entity.Trip;

public class TripMapper {
    private TripMapper() {}

    public static TripResponse toResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .currency(trip.getCurrency())
                .createdAt(trip.getCreatedAt())
                .build();
    }

    public static Trip toEntity(TripRequest request) {
        Trip trip = new Trip();
        trip.setName(request.getName());
        trip.setDestination(request.getDestination());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setCurrency(request.getCurrency() == null || request.getCurrency().isBlank() ? "USD" : request.getCurrency());
        return trip;
    }
}
