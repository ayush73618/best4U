package com.best4u.backend.notification.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
public class Notification extends BaseEntity {

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String type; // ORDER_SHIPPED, ORDER_DELIVERED, SELLER_APPROVED, REVIEW_ELIGIBLE

    @Column(nullable = false)
    private String message;

    private String link; // deep link, e.g. /shop/orders or /shop/products/{id}

    @Column(nullable = false)
    private boolean isRead = false;
}