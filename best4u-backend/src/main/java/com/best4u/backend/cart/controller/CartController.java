// controller/CartController.java
package com.best4u.backend.cart.controller;

import com.best4u.backend.cart.dto.CartItemRequest;
import com.best4u.backend.cart.dto.CartItemResponse;
import com.best4u.backend.cart.service.CartService;
import com.best4u.backend.common.Best4UResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public Best4UResponse<List<CartItemResponse>> view() {
        return Best4UResponse.ok(cartService.viewCart());
    }

    @PostMapping("/items")
    public Best4UResponse<CartItemResponse> addOrUpdate(@Valid @RequestBody CartItemRequest request) {
        return Best4UResponse.ok(cartService.addOrUpdateItem(request));
    }

    @DeleteMapping("/items/{id}")
    public Best4UResponse<Void> remove(@PathVariable Long id) {
        cartService.removeItem(id);
        return Best4UResponse.ok(null);
    }

    @DeleteMapping
    public Best4UResponse<Void> clear() {
        cartService.clearCart();
        return Best4UResponse.ok(null);
    }
}