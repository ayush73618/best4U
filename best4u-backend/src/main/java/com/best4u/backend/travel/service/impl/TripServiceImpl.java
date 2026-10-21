package com.best4u.backend.travel.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.security.AuthUtil;
import com.best4u.backend.travel.dto.TripMapper;
import com.best4u.backend.travel.dto.TripRequest;
import com.best4u.backend.travel.dto.TripResponse;
import com.best4u.backend.travel.entity.Trip;
import com.best4u.backend.travel.repository.TripRepository;
import com.best4u.backend.travel.service.TripService;
import com.best4u.backend.travel.specification.TripSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

    public TripServiceImpl(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    @Override
    public Page<TripResponse> listMine(String keyword, Pageable pageable) {
        Long userId = AuthUtil.currentUserId();
        var spec = TripSpecifications.belongsToUser(userId)
                .and(TripSpecifications.nameOrDestinationContains(keyword));
        return tripRepository.findAll(spec, pageable).map(TripMapper::toResponse);
    }

    @Override
    @Transactional
    public TripResponse create(TripRequest request) {
        Trip trip = TripMapper.toEntity(request);
        trip.setUserId(AuthUtil.currentUserId());
        return TripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public void delete(Long tripId) {
        tripRepository.delete(verifyOwnership(tripId));
    }

    @Override
    public Trip verifyOwnership(Long tripId) {
        return tripRepository.findByIdAndUserId(tripId, AuthUtil.currentUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Trip not found."));
    }
}
