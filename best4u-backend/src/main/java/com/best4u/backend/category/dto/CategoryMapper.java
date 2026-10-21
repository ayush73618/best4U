// dto/CategoryMapper.java
package com.best4u.backend.category.dto;

import com.best4u.backend.category.entity.Category;

public class CategoryMapper {
    private CategoryMapper() {}

    public static CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder().id(category.getId()).name(category.getName()).slug(category.getSlug()).build();
    }

    // Slug is derived, not user-entered - "Home & Kitchen" becomes
    // "home-kitchen", a clean, URL-safe, guaranteed-unique key without
    // asking whoever creates the category to think about URLs.
    public static Category toEntity(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(slugify(request.getName()));
        return category;
    }

    private static String slugify(String name) {
        return name.trim().toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}