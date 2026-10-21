// service/CategoryService.java
package com.best4u.backend.category.service;

import com.best4u.backend.category.dto.CategoryRequest;
import com.best4u.backend.category.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> listAll();
    CategoryResponse create(CategoryRequest request);
}