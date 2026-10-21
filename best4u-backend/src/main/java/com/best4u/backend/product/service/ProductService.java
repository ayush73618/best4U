package com.best4u.backend.product.service;

import com.best4u.backend.product.dto.ProductRequest;
import com.best4u.backend.product.dto.ProductResponse;
import com.best4u.backend.product.dto.ProductUpdateRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    Page<ProductResponse> listAll(Long categoryId, String search, Pageable pageable);
    ProductResponse getById(Long id);
    ProductResponse create(ProductRequest request, List<MultipartFile> images) throws IOException;

    Page<ProductResponse> listMine(Pageable pageable);
    Page<ProductResponse> listPendingReview(Pageable pageable);
    void approveProduct(Long id);
    void rejectProduct(Long id);
    List<ProductResponse> listRelated(Long productId, int limit);
    ProductResponse updateMyListing(Long id, ProductUpdateRequest request);
}