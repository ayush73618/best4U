package com.best4u.backend.travel.itinerary.dto;

import com.best4u.backend.travel.itinerary.entity.ItineraryItem;

public class ItineraryMapper {
    private ItineraryMapper() {}

    public static ItineraryItemResponse toResponse(ItineraryItem item) {
        return ItineraryItemResponse.builder()
                .id(item.getId()).day(item.getDay()).time(item.getTime())
                .title(item.getTitle()).notes(item.getNotes()).build();
    }

    public static ItineraryItem toEntity(ItineraryItemRequest request) {
        ItineraryItem item = new ItineraryItem();
        item.setDay(request.getDay());
        item.setTime(request.getTime());
        item.setTitle(request.getTitle());
        item.setNotes(request.getNotes());
        return item;
    }
}
