package com.best4u.backend.cart.dto;

import com.best4u.backend.cart.entity.CartItem;
import com.best4u.backend.product.entity.Product;

public class CartMapper {
    private CartMapper() {}

    public static CartItemResponse toResponse(CartItem item, Product product) {
        // Guard against empty imageUrls — get(0) throws IndexOutOfBoundsException
        // if a product was saved without images (possible during testing or
        // if a seed entry somehow had an empty list). null is the correct
        // fallback; the frontend already handles null with a placeholder.
        String thumbnail = product.getImageUrls().isEmpty()
                ? null
                : product.getImageUrls().get(0);

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(product.getName())
                .unitPrice(product.getPrice())
                .quantity(item.getQuantity())
                .lineTotal(product.getPrice() * item.getQuantity())
                .imageUrl(thumbnail)
                .build();
    }
}