package com.best4u.backend.user.dto;

import com.best4u.backend.user.entity.User;

public class UserMapper {
    private UserMapper() {}

    public static AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .roles(user.getRoles())
                .sellerStatus(user.getSellerStatus())
                .build();
    }
}
