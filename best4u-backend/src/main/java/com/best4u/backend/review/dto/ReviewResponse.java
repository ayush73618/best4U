package com.best4u.backend.review.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ReviewResponse {
    Long id;
    Integer rating;
    String comment;
    String reviewerName;
    Instant createdAt;
}