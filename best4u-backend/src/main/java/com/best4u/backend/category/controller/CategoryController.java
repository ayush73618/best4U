// controller/CategoryController.java
package com.best4u.backend.category.controller;

import com.best4u.backend.category.dto.CategoryRequest;
import com.best4u.backend.category.dto.CategoryResponse;
import com.best4u.backend.category.service.CategoryService;
import com.best4u.backend.common.Best4UResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public Best4UResponse<List<CategoryResponse>> list() {
        return Best4UResponse.ok(categoryService.listAll());
    }

    @PostMapping
    public Best4UResponse<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return Best4UResponse.ok("Category created.", categoryService.create(request));
    }
}