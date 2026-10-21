package com.best4u.backend.product.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.product.dto.ProductMapper;
import com.best4u.backend.product.dto.ProductRequest;
import com.best4u.backend.product.dto.ProductResponse;
import com.best4u.backend.product.dto.ProductUpdateRequest;
import com.best4u.backend.product.entity.Product;
import com.best4u.backend.product.entity.ProductStatus;
import com.best4u.backend.product.repository.ProductRepository;
import com.best4u.backend.product.service.ProductService;
import com.best4u.backend.product.specification.ProductSpecifications;
import com.best4u.backend.review.repository.ReviewRepository;
import com.best4u.backend.security.AuthUtil;
import com.best4u.backend.storage.ImageStorageService;
import com.best4u.backend.user.entity.SellerStatus;
import com.best4u.backend.user.entity.User;
import com.best4u.backend.user.repository.SellerProfileRepository;
import com.best4u.backend.user.repository.UserRepository;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductServiceImpl implements ProductService {

	 private final ProductRepository productRepository;
	    private final UserRepository userRepository;
	    private final ImageStorageService imageStorageService;
	    private final SellerProfileRepository sellerProfileRepository;

	    private final ReviewRepository reviewRepository;

	    public ProductServiceImpl(ProductRepository productRepository,
	                               UserRepository userRepository,
	                               ImageStorageService imageStorageService,
	                               SellerProfileRepository sellerProfileRepository,
	                               ReviewRepository reviewRepository) {
	        this.productRepository = productRepository;
	        this.userRepository = userRepository;
	        this.imageStorageService = imageStorageService;
	        this.sellerProfileRepository = sellerProfileRepository;
	        this.reviewRepository = reviewRepository;
	    }

	    @Override
	    public Page<ProductResponse> listAll(Long categoryId, String search, Pageable pageable) {
	        var spec = ProductSpecifications.belongsToCategory(categoryId)
	                .and(ProductSpecifications.nameOrDescriptionContains(search))
	                .and(ProductSpecifications.isApproved());
	        return productRepository.findAll(spec, pageable).map(this::toResponse);
	    }

    @Override
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found."));
        return toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse create(ProductRequest request, List<MultipartFile> images) throws IOException {
        Long sellerId = AuthUtil.currentUserId();
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));

        if (seller.getSellerStatus() != SellerStatus.APPROVED) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You need to be an approved seller to list products.");
        }

        Product product = ProductMapper.toEntity(request);
        product.setImageUrls(imageStorageService.storeAll(images));
        product.setSellerId(sellerId);
        product.setStatus(ProductStatus.PENDING_REVIEW);

        return toResponse(productRepository.save(product));
    }

    @Override
    public Page<ProductResponse> listMine(Pageable pageable) {
        var spec = ProductSpecifications.belongsToSeller(AuthUtil.currentUserId());
        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Override
    public Page<ProductResponse> listPendingReview(Pageable pageable) {
        var spec = ProductSpecifications.hasStatus(ProductStatus.PENDING_REVIEW);
        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public void approveProduct(Long id) {
        Product product = productById(id);
        product.setStatus(ProductStatus.APPROVED);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void rejectProduct(Long id) {
        Product product = productById(id);
        product.setStatus(ProductStatus.REJECTED);
        productRepository.save(product);
    }

    private Product productById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found."));
    }
    
    private String resolveSellerName(Long sellerId) {
        if (sellerId == null) return null;
        return sellerProfileRepository.findByUserId(sellerId)
                .map(p -> p.getShopName())
                .orElse(null);
    }
    
    @Override
    public List<ProductResponse> listRelated(Long productId, int limit) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found."));

        var spec = ProductSpecifications.belongsToCategory(product.getCategoryId())
                .and(ProductSpecifications.isApproved())
                .and((root, query, cb) -> cb.notEqual(root.get("id"), productId));

        return productRepository.findAll(spec, Pageable.ofSize(limit))
                .stream()
                .map(this::toResponse)
                .toList();
    }
    
    @Override
    @Transactional
    public ProductResponse updateMyListing(Long id, ProductUpdateRequest request) {
        Long sellerId = AuthUtil.currentUserId();
        var spec = ProductSpecifications.belongsToSeller(sellerId)
                .and((root, query, cb) -> cb.equal(root.get("id"), id));

        Product product = productRepository.findAll(spec)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "Listing not found or not yours."));

        boolean contentChanged = false;

        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }
        if (request.getName() != null && !request.getName().isBlank()) {
            product.setName(request.getName());
            contentChanged = true;
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
            contentChanged = true;
        }

        // Content changes (name/description) go back to review.
        // Price/stock changes are operational and stay APPROVED.
        if (contentChanged && product.getStatus() == ProductStatus.APPROVED) {
            product.setStatus(ProductStatus.PENDING_REVIEW);
        }

        return toResponse(productRepository.save(product));
    }
    
    private ProductResponse toResponse(Product product) {
        String thumbnail = product.getImageUrls().isEmpty()
                ? null : product.getImageUrls().get(0);
        String sellerName = resolveSellerName(product.getSellerId());
        double avg = reviewRepository.findAverageRatingByProductId(product.getId()).orElse(0.0);
        long count = reviewRepository.countByProductId(product.getId());

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
                .averageRating(Math.round(avg * 10.0) / 10.0)
                .reviewCount(count)
                .build();
    }
}