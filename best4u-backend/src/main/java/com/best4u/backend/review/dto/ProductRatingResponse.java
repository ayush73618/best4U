package com.best4u.backend.review.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProductRatingResponse {
    double averageRating;
    long reviewCount;
    boolean canReview; // true if the caller has a DELIVERED order with this product
}