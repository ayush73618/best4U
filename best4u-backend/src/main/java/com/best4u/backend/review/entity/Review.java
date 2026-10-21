package com.best4u.backend.review.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "review",
    uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "productId"})
)
@Getter
@Setter
@NoArgsConstructor
public class Review extends BaseEntity {

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Long userId;

    // orderId proves this review comes from someone who actually
    // received the product - not just a random account spamming stars.
    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String comment;

    private String reviewerName; // snapshot at review time
}