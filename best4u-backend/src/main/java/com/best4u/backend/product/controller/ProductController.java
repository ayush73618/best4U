package com.best4u.backend.product.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.product.dto.ProductRequest;
import com.best4u.backend.product.dto.ProductResponse;
import com.best4u.backend.product.dto.ProductUpdateRequest;
import com.best4u.backend.product.service.ProductService;
import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Best4UResponse<Page<ProductResponse>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return Best4UResponse.ok(productService.listAll(categoryId, search, pageable));
    }

    @GetMapping("/{id}")
    public Best4UResponse<ProductResponse> getById(@PathVariable Long id) {
        return Best4UResponse.ok(productService.getById(id));
    }

    // Requires an approved seller - enforced in the service, not here,
    // since "is this user allowed to do this" is a business rule, not
    // an HTTP concern.
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Best4UResponse<ProductResponse> create(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart("images") List<MultipartFile> images
    ) throws IOException {
        return Best4UResponse.ok("Product submitted for review.", productService.create(request, images));
    }

    @GetMapping("/mine")
    public Best4UResponse<Page<ProductResponse>> listMine(@PageableDefault(size = 20) Pageable pageable) {
        return Best4UResponse.ok(productService.listMine(pageable));
    }
    
    @GetMapping("/{id}/related")
    public Best4UResponse<List<ProductResponse>> related(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit
    ) {
        return Best4UResponse.ok(productService.listRelated(id, limit));
    }
    
    @PatchMapping("/{id}")
    public Best4UResponse<ProductResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request
    ) {
        return Best4UResponse.ok(productService.updateMyListing(id, request));
    }
}