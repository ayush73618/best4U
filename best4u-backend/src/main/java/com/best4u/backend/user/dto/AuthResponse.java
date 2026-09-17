package com.best4u.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private List<String> roles;
}