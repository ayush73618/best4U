package com.best4u.backend.admin.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.product.dto.ProductResponse;
import com.best4u.backend.product.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/pending")
    public Best4UResponse<Page<ProductResponse>> pending(@PageableDefault(size = 20) Pageable pageable) {
        return Best4UResponse.ok(productService.listPendingReview(pageable));
    }

    @PutMapping("/{id}/approve")
    public Best4UResponse<Void> approve(@PathVariable Long id) {
        productService.approveProduct(id);
        return Best4UResponse.ok("Product approved.", null);
    }

    @PutMapping("/{id}/reject")
    public Best4UResponse<Void> reject(@PathVariable Long id) {
        productService.rejectProduct(id);
        return Best4UResponse.ok("Product rejected.", null);
    }
}