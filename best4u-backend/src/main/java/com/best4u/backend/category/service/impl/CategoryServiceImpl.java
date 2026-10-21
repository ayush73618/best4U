// service/impl/CategoryServiceImpl.java
package com.best4u.backend.category.service.impl;

import com.best4u.backend.category.dto.CategoryMapper;
import com.best4u.backend.category.dto.CategoryRequest;
import com.best4u.backend.category.dto.CategoryResponse;
import com.best4u.backend.category.entity.Category;
import com.best4u.backend.category.repository.CategoryRepository;
import com.best4u.backend.category.service.CategoryService;
import com.best4u.backend.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryResponse> listAll() {
        return categoryRepository.findAll().stream().map(CategoryMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = CategoryMapper.toEntity(request);
        if (categoryRepository.existsBySlug(category.getSlug())) {
            throw new ApiException(HttpStatus.CONFLICT, "A category with this name already exists.");
        }
        return CategoryMapper.toResponse(categoryRepository.save(category));
    }
}