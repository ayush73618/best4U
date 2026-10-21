package com.best4u.backend.travel.itinerary.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.travel.itinerary.dto.ItineraryItemRequest;
import com.best4u.backend.travel.itinerary.dto.ItineraryItemResponse;
import com.best4u.backend.travel.itinerary.dto.ItineraryMapper;
import com.best4u.backend.travel.itinerary.entity.ItineraryItem;
import com.best4u.backend.travel.itinerary.repository.ItineraryRepository;
import com.best4u.backend.travel.itinerary.service.ItineraryService;
import com.best4u.backend.travel.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItineraryServiceImpl implements ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TripService tripService;

    public ItineraryServiceImpl(ItineraryRepository itineraryRepository, TripService tripService) {
        this.itineraryRepository = itineraryRepository;
        this.tripService = tripService;
    }

    @Override
    public List<ItineraryItemResponse> listForTrip(Long tripId) {
        tripService.verifyOwnership(tripId);
        return itineraryRepository.findByTripIdOrderByDayAscTimeAsc(tripId)
                .stream().map(ItineraryMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public ItineraryItemResponse create(Long tripId, ItineraryItemRequest request) {
        tripService.verifyOwnership(tripId);
        ItineraryItem item = ItineraryMapper.toEntity(request);
        item.setTripId(tripId);
        return ItineraryMapper.toResponse(itineraryRepository.save(item));
    }

    @Override
    @Transactional
    public void delete(Long tripId, Long itemId) {
        tripService.verifyOwnership(tripId);
        ItineraryItem item = itineraryRepository.findByIdAndTripId(itemId, tripId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Itinerary item not found."));
        itineraryRepository.delete(item);
    }
}
