package com.best4u.backend.product.dto;

import com.best4u.backend.product.entity.ProductStatus;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class ProductResponse {
    Long id;
    String name;
    String description;
    Double price;
    Long categoryId;
    Integer stockQuantity;
    boolean inStock;
    List<String> imageUrls;
    String imageUrl; // convenience: first of imageUrls, or null - saves every frontend list view from re-deriving this
    ProductStatus status;
    String sellerName; // shop name from SellerProfile, null for seeded products
    // Aggregated from reviews - 0.0 and 0 when no reviews exist yet
    double averageRating;
    long reviewCount;
}