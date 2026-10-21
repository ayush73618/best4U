package com.best4u.backend.travel.packing.dto;

import com.best4u.backend.travel.packing.entity.PackingItem;

public class PackingMapper {
    private PackingMapper() {}

    public static PackingItemResponse toResponse(PackingItem item) {
        return PackingItemResponse.builder().id(item.getId()).text(item.getText()).packed(item.isPacked()).build();
    }
}
