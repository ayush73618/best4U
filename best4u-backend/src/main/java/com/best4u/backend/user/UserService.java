package com.best4u.backend.user;

import com.best4u.backend.user.dto.AuthResponse;
import com.best4u.backend.user.dto.LoginRequest;
import com.best4u.backend.user.dto.RegisterRequest;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
