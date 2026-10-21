package com.best4u.backend.review.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.review.dto.ProductRatingResponse;
import com.best4u.backend.review.dto.ReviewRequest;
import com.best4u.backend.review.dto.ReviewResponse;
import com.best4u.backend.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products/{productId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public Best4UResponse<ReviewResponse> submit(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request
    ) {
        return Best4UResponse.ok("Review submitted.", reviewService.submitReview(productId, request));
    }

    @GetMapping
    public Best4UResponse<Page<ReviewResponse>> list(
            @PathVariable Long productId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return Best4UResponse.ok(reviewService.listReviews(productId, pageable));
    }

    @GetMapping("/rating")
    public Best4UResponse<ProductRatingResponse> rating(@PathVariable Long productId) {
        return Best4UResponse.ok(reviewService.getRating(productId));
    }
}