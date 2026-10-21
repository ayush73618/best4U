// service/impl/CartServiceImpl.java
package com.best4u.backend.cart.service.impl;

import com.best4u.backend.cart.dto.CartItemRequest;
import com.best4u.backend.cart.dto.CartItemResponse;
import com.best4u.backend.cart.dto.CartMapper;
import com.best4u.backend.cart.entity.CartItem;
import com.best4u.backend.cart.repository.CartRepository;
import com.best4u.backend.cart.service.CartService;
import com.best4u.backend.common.ApiException;
import com.best4u.backend.product.entity.Product;
import com.best4u.backend.product.repository.ProductRepository;
import com.best4u.backend.security.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<CartItemResponse> viewCart() {
        Long userId = AuthUtil.currentUserId();
        return cartRepository.findByUserId(userId).stream()
                .map(item -> CartMapper.toResponse(item, productFor(item.getProductId())))
                .toList();
    }

    @Override
    @Transactional
    public CartItemResponse addOrUpdateItem(CartItemRequest request) {
        Long userId = AuthUtil.currentUserId();
        Product product = productFor(request.getProductId());

        // Adding a product already in the cart updates its quantity
        // rather than creating a second row - enforced structurally by
        // the unique (userId, productId) constraint on CartItem, not
        // just by this lookup.
        CartItem item = cartRepository.findByUserIdAndProductId(userId, request.getProductId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUserId(userId);
                    newItem.setProductId(request.getProductId());
                    return newItem;
                });

        item.setQuantity(request.getQuantity());
        return CartMapper.toResponse(cartRepository.save(item), product);
    }

    @Override
    @Transactional
    public void removeItem(Long cartItemId) {
        Long userId = AuthUtil.currentUserId();
        CartItem item = cartRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart item not found."));
        cartRepository.delete(item);
    }

    @Override
    @Transactional
    public void clearCart() {
        cartRepository.deleteByUserId(AuthUtil.currentUserId());
    }

    private Product productFor(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found."));
    }
}