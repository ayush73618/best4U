package com.best4u.backend.user.service;

import com.best4u.backend.user.dto.*;

import java.util.List;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

    ProfileResponse getMyProfile();
    AuthResponse updateProfile(UpdateProfileRequest request);

    // Now takes a real form, not just a single tap
    void applyForSeller(SellerApplicationRequest request);

    SellerProfileResponse getMySellerProfile();

    List<SellerApplicationResponse> listPendingSellers();
    void approveSeller(Long userId);
    void rejectSeller(Long userId);
}