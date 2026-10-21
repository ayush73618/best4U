package com.best4u.backend.user.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;
import com.best4u.backend.user.entity.SellerStatus;

@Value
@Builder
public class AuthResponse {
    String token;
    Long userId;
    String firstName;
    String lastName;
    String email;
    String mobileNumber;
    List<String> roles;
    SellerStatus sellerStatus;
}
