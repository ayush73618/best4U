package com.best4u.backend.product.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Long categoryId;

    @Column(nullable = false)
    private Integer stockQuantity = 0;

    // First entry is the thumbnail shown wherever a single image is
    // needed (cards, cart, order history) - same @ElementCollection
    // pattern already used for Habit.completedDates.
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    // Null for seeded/system products (no real seller). Set to the
    // submitting user's ID for anything created through the seller form.
    private Long sellerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.PENDING_REVIEW;
}