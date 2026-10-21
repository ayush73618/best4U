package com.best4u.backend.review.service;

import com.best4u.backend.review.dto.ProductRatingResponse;
import com.best4u.backend.review.dto.ReviewRequest;
import com.best4u.backend.review.dto.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse submitReview(Long productId, ReviewRequest request);
    Page<ReviewResponse> listReviews(Long productId, Pageable pageable);
    ProductRatingResponse getRating(Long productId);
}