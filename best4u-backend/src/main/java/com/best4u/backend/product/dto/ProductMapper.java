package com.best4u.backend.product.dto;

import com.best4u.backend.product.entity.Product;

public class ProductMapper {
    private ProductMapper() {}

    public static ProductResponse toResponse(Product product) {
        return toResponse(product, null);
    }

    public static ProductResponse toResponse(Product product, String sellerName) {
        String thumbnail = product.getImageUrls().isEmpty()
                ? null : product.getImageUrls().get(0);
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .categoryId(product.getCategoryId())
                .stockQuantity(product.getStockQuantity())
                .inStock(product.getStockQuantity() != null && product.getStockQuantity() > 0)
                .imageUrls(product.getImageUrls())
                .imageUrl(thumbnail)
                .status(product.getStatus())
                .sellerName(sellerName)
                .build();
    }

    public static Product toEntity(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategoryId(request.getCategoryId());
        product.setStockQuantity(request.getStockQuantity());
        return product;
    }
}