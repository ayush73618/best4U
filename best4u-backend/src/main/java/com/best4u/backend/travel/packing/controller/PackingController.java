package com.best4u.backend.travel.packing.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.travel.packing.dto.PackingItemRequest;
import com.best4u.backend.travel.packing.dto.PackingItemResponse;
import com.best4u.backend.travel.packing.service.PackingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travel/trips/{tripId}/packing")
public class PackingController {

    private final PackingService packingService;

    public PackingController(PackingService packingService) {
        this.packingService = packingService;
    }

    @GetMapping
    public Best4UResponse<List<PackingItemResponse>> list(@PathVariable Long tripId) {
        return Best4UResponse.ok(packingService.listForTrip(tripId));
    }

    @PostMapping
    public Best4UResponse<PackingItemResponse> create(@PathVariable Long tripId, @Valid @RequestBody PackingItemRequest request) {
        return Best4UResponse.ok(packingService.create(tripId, request));
    }

    @PutMapping("/{itemId}/toggle")
    public Best4UResponse<PackingItemResponse> toggle(@PathVariable Long tripId, @PathVariable Long itemId) {
        return Best4UResponse.ok(packingService.togglePacked(tripId, itemId));
    }

    @DeleteMapping("/{itemId}")
    public Best4UResponse<Void> delete(@PathVariable Long tripId, @PathVariable Long itemId) {
        packingService.delete(tripId, itemId);
        return Best4UResponse.ok(null);
    }
}
