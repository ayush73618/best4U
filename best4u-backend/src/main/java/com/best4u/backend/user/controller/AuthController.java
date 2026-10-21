package com.best4u.backend.user.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.user.dto.*;
import com.best4u.backend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public Best4UResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return Best4UResponse.ok("Account created.", userService.register(request));
    }

    @PostMapping("/login")
    public Best4UResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return Best4UResponse.ok("Logged in.", userService.login(request));
    }

    @PostMapping("/apply-seller")
    public Best4UResponse<Void> applyForSeller(@Valid @RequestBody SellerApplicationRequest request) {
        userService.applyForSeller(request);
        return Best4UResponse.ok("Application submitted. We'll review it shortly.", null);
    }

    @GetMapping("/seller-profile")
    public Best4UResponse<SellerProfileResponse> getSellerProfile() {
        return Best4UResponse.ok(userService.getMySellerProfile());
    }

    @GetMapping("/profile")
    public Best4UResponse<ProfileResponse> getProfile() {
        return Best4UResponse.ok(userService.getMyProfile());
    }

    @PutMapping("/profile")
    public Best4UResponse<AuthResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        return Best4UResponse.ok("Profile updated.", userService.updateProfile(request));
    }
}