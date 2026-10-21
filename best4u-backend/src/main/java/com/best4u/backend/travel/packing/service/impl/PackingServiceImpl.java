package com.best4u.backend.travel.packing.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.travel.packing.dto.PackingItemRequest;
import com.best4u.backend.travel.packing.dto.PackingItemResponse;
import com.best4u.backend.travel.packing.dto.PackingMapper;
import com.best4u.backend.travel.packing.entity.PackingItem;
import com.best4u.backend.travel.packing.repository.PackingRepository;
import com.best4u.backend.travel.packing.service.PackingService;
import com.best4u.backend.travel.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PackingServiceImpl implements PackingService {

    private final PackingRepository packingRepository;
    private final TripService tripService;

    public PackingServiceImpl(PackingRepository packingRepository, TripService tripService) {
        this.packingRepository = packingRepository;
        this.tripService = tripService;
    }

    @Override
    public List<PackingItemResponse> listForTrip(Long tripId) {
        tripService.verifyOwnership(tripId);
        return packingRepository.findByTripIdOrderByIdAsc(tripId).stream().map(PackingMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public PackingItemResponse create(Long tripId, PackingItemRequest request) {
        tripService.verifyOwnership(tripId);
        PackingItem item = new PackingItem();
        item.setTripId(tripId);
        item.setText(request.getText());
        return PackingMapper.toResponse(packingRepository.save(item));
    }

    @Override
    @Transactional
    public PackingItemResponse togglePacked(Long tripId, Long itemId) {
        tripService.verifyOwnership(tripId);
        PackingItem item = owned(tripId, itemId);
        item.setPacked(!item.isPacked());
        return PackingMapper.toResponse(packingRepository.save(item));
    }

    @Override
    @Transactional
    public void delete(Long tripId, Long itemId) {
        tripService.verifyOwnership(tripId);
        packingRepository.delete(owned(tripId, itemId));
    }

    private PackingItem owned(Long tripId, Long itemId) {
        return packingRepository.findByIdAndTripId(itemId, tripId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Packing item not found."));
    }
}
