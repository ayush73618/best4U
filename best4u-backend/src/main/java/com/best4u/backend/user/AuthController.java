package com.best4u.backend.user;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.user.dto.AuthResponse;
import com.best4u.backend.user.dto.LoginRequest;
import com.best4u.backend.user.dto.RegisterRequest;
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
}
