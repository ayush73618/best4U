package com.best4u.backend.review.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.notification.service.NotificationService;
import com.best4u.backend.order.entity.OrderStatus;
import com.best4u.backend.order.repository.OrderItemRepository;
import com.best4u.backend.order.repository.OrderRepository;
import com.best4u.backend.review.dto.ProductRatingResponse;
import com.best4u.backend.review.dto.ReviewRequest;
import com.best4u.backend.review.dto.ReviewResponse;
import com.best4u.backend.review.entity.Review;
import com.best4u.backend.review.repository.ReviewRepository;
import com.best4u.backend.review.service.ReviewService;
import com.best4u.backend.security.AuthUtil;
import com.best4u.backend.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                              OrderRepository orderRepository,
                              OrderItemRepository orderItemRepository,
                              UserRepository userRepository,
                              NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public ReviewResponse submitReview(Long productId, ReviewRequest request) {
        Long userId = AuthUtil.currentUserId();

        if (reviewRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "You've already reviewed this product.");
        }

        // Proof-of-purchase: find a DELIVERED order by this user
        // that contains this product.
        Long orderId = findDeliveredOrderWithProduct(userId, productId);
        if (orderId == null) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "You can only review products from a delivered order.");
        }

        String reviewerName = userRepository.findById(userId)
                .map(u -> u.getFirstName() + " " + u.getLastName().charAt(0) + ".")
                .orElse("Verified buyer");

        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setOrderId(orderId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewerName(reviewerName);
        
        Review saved = reviewRepository.save(review);
        notificationService.create(userId, "REVIEW_SUBMITTED",
                "Your review has been published.", "/shop/orders");
        return toResponse(saved);
    }

    @Override
    public Page<ReviewResponse> listReviews(Long productId, Pageable pageable) {
        return reviewRepository
                .findByProductIdOrderByCreatedAtDesc(productId, pageable)
                .map(this::toResponse);
    }

    @Override
    public ProductRatingResponse getRating(Long productId) {
        double avg = reviewRepository.findAverageRatingByProductId(productId)
                .orElse(0.0);
        long count = reviewRepository.countByProductId(productId);

        // Check if the current user can leave a review
        boolean canReview = false;
        try {
            Long userId = AuthUtil.currentUserId();
            if (userId != null && !reviewRepository.existsByUserIdAndProductId(userId, productId)) {
                canReview = findDeliveredOrderWithProduct(userId, productId) != null;
            }
        } catch (Exception ignored) {
            // Unauthenticated request - canReview stays false
        }

        return ProductRatingResponse.builder()
                .averageRating(Math.round(avg * 10.0) / 10.0)
                .reviewCount(count)
                .canReview(canReview)
                .build();
    }

    private Long findDeliveredOrderWithProduct(Long userId, Long productId) {
        // Find all DELIVERED orders by this user, then check if any
        // of them contain this product.
        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged())
                .stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .filter(o -> orderItemRepository.findByOrderId(o.getId())
                        .stream()
                        .anyMatch(item -> item.getProductId().equals(productId)))
                .findFirst()
                .map(o -> o.getId())
                .orElse(null);
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewerName(review.getReviewerName())
                .createdAt(review.getCreatedAt())
                .build();
    }
}