package com.best4u.backend.travel.packing.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PackingItemResponse {
    Long id;
    String text;
    boolean packed;
}
