package com.best4u.backend.user.dto;

import com.best4u.backend.user.entity.SellerStatus;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class ProfileResponse {
    Long userId;
    String firstName;
    String lastName;
    String email;
    String mobileNumber;
    List<String> roles;
    SellerStatus sellerStatus;
}