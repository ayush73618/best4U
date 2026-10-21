package com.best4u.backend.product.specification;

import com.best4u.backend.product.entity.Product;
import com.best4u.backend.product.entity.ProductStatus;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecifications {
    private ProductSpecifications() {}

    public static Specification<Product> belongsToCategory(Long categoryId) {
        return categoryId == null
                ? (root, query, cb) -> cb.conjunction()
                : (root, query, cb) -> cb.equal(root.get("categoryId"), categoryId);
    }

    public static Specification<Product> nameOrDescriptionContains(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return (root, query, cb) -> cb.conjunction();
        }
        String pattern = "%" + keyword.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("description")), pattern)
        );
    }

    // Applied to every SHOPPER-facing query - a pending or rejected
    // listing must never appear in the public catalog, category filter,
    // or search results.
    public static Specification<Product> isApproved() {
        return (root, query, cb) -> cb.equal(root.get("status"), ProductStatus.APPROVED);
    }

    public static Specification<Product> belongsToSeller(Long sellerId) {
        return (root, query, cb) -> cb.equal(root.get("sellerId"), sellerId);
    }

    public static Specification<Product> hasStatus(ProductStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
}