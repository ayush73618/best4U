package com.best4u.backend.travel.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.travel.dto.TripRequest;
import com.best4u.backend.travel.dto.TripResponse;
import com.best4u.backend.travel.service.TripService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/travel/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public Best4UResponse<Page<TripResponse>> list(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "startDate") Pageable pageable
    ) {
        return Best4UResponse.ok(tripService.listMine(keyword, pageable));
    }

    @PostMapping
    public Best4UResponse<TripResponse> create(@Valid @RequestBody TripRequest request) {
        return Best4UResponse.ok("Trip created.", tripService.create(request));
    }

    @DeleteMapping("/{id}")
    public Best4UResponse<Void> delete(@PathVariable Long id) {
        tripService.delete(id);
        return Best4UResponse.ok(null);
    }
}
