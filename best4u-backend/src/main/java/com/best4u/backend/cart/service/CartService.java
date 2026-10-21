// service/CartService.java
package com.best4u.backend.cart.service;

import com.best4u.backend.cart.dto.CartItemRequest;
import com.best4u.backend.cart.dto.CartItemResponse;

import java.util.List;

public interface CartService {
    List<CartItemResponse> viewCart();
    CartItemResponse addOrUpdateItem(CartItemRequest request);
    void removeItem(Long cartItemId);
    void clearCart();
}