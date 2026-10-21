package com.best4u.backend.user.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.notification.service.NotificationService;
import com.best4u.backend.security.AuthUtil;
import com.best4u.backend.security.JwtService;
import com.best4u.backend.user.dto.*;
import com.best4u.backend.user.entity.SellerProfile;
import com.best4u.backend.user.entity.SellerStatus;
import com.best4u.backend.user.entity.User;
import com.best4u.backend.user.repository.SellerProfileRepository;
import com.best4u.backend.user.repository.UserRepository;
import com.best4u.backend.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    public UserServiceImpl(UserRepository userRepository,
                           SellerProfileRepository sellerProfileRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,NotificationService notificationService) {
        this.userRepository = userRepository;
        this.sellerProfileRepository = sellerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "An account with this email already exists.");
        }
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        return UserMapper.toAuthResponse(user, jwtService.generateToken(user.getId()));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED,
                        "Invalid email or password."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return UserMapper.toAuthResponse(user, jwtService.generateToken(user.getId()));
    }

    @Override
    public ProfileResponse getMyProfile() {
        User user = currentUser();
        return ProfileResponse.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .roles(user.getRoles())
                .sellerStatus(user.getSellerStatus())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setMobileNumber(request.getMobileNumber());
        userRepository.save(user);
        return UserMapper.toAuthResponse(user, jwtService.generateToken(user.getId()));
    }

    @Override
    @Transactional
    public void applyForSeller(SellerApplicationRequest request) {
        User user = currentUser();

        if (user.getSellerStatus() == SellerStatus.PENDING) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "Your seller application is already pending review.");
        }
        if (user.getSellerStatus() == SellerStatus.APPROVED) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "You're already an approved seller.");
        }

        // Create or update the seller profile
        SellerProfile profile = sellerProfileRepository
                .findByUserId(user.getId())
                .orElseGet(() -> {
                    SellerProfile p = new SellerProfile();
                    p.setUserId(user.getId());
                    return p;
                });

        profile.setShopName(request.getShopName());
        profile.setBusinessType(request.getBusinessType());
        profile.setPrimaryCategory(request.getPrimaryCategory());
        profile.setBusinessPhone(request.getBusinessPhone());
        profile.setBusinessAddress(request.getBusinessAddress());
        profile.setGstNumber(request.getGstNumber());
        profile.setBankAccountName(request.getBankAccountName());
        profile.setBankAccountNumber(request.getBankAccountNumber());
        profile.setBankIfscCode(request.getBankIfscCode());
        profile.setUpiId(request.getUpiId());
        profile.setWhyDoYouWantToSell(request.getWhyDoYouWantToSell());
        sellerProfileRepository.save(profile);

        user.setSellerStatus(SellerStatus.PENDING);
        userRepository.save(user);
    }

    @Override
    public SellerProfileResponse getMySellerProfile() {
        Long userId = AuthUtil.currentUserId();
        SellerProfile profile = sellerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "No seller profile found."));
        return toSellerProfileResponse(profile);
    }

    @Override
    public List<SellerApplicationResponse> listPendingSellers() {
        return userRepository.findBySellerStatus(SellerStatus.PENDING).stream()
                .map(u -> {
                    SellerProfile profile = sellerProfileRepository
                            .findByUserId(u.getId()).orElse(null);
                    return SellerApplicationResponse.builder()
                            .userId(u.getId())
                            .firstName(u.getFirstName())
                            .lastName(u.getLastName())
                            .email(u.getEmail())
                            .sellerStatus(u.getSellerStatus())
                            .shopName(profile != null ? profile.getShopName() : null)
                            .businessType(profile != null ? profile.getBusinessType() : null)
                            .primaryCategory(profile != null ? profile.getPrimaryCategory() : null)
                            .businessPhone(profile != null ? profile.getBusinessPhone() : null)
                            .businessAddress(profile != null ? profile.getBusinessAddress() : null)
                            .gstNumber(profile != null ? profile.getGstNumber() : null)
                            .whyDoYouWantToSell(profile != null ? profile.getWhyDoYouWantToSell() : null)
                            .build();
                })
                .toList();
    }

    @Override
    @Transactional
    public void approveSeller(Long userId) {
        User user = userById(userId);
        user.setSellerStatus(SellerStatus.APPROVED);
        if (!user.getRoles().contains("SELLER")) {
            user.getRoles().add("SELLER");
        }
        userRepository.save(user);
        notificationService.create(userId, "SELLER_APPROVED",
                "Your seller application has been approved! You can now list products.",
                "/sell");
    }

    @Override
    @Transactional
    public void rejectSeller(Long userId) {
        User user = userById(userId);
        user.setSellerStatus(SellerStatus.REJECTED);
        userRepository.save(user);
    }

    private SellerProfileResponse toSellerProfileResponse(SellerProfile p) {
        return SellerProfileResponse.builder()
                .shopName(p.getShopName())
                .businessType(p.getBusinessType())
                .primaryCategory(p.getPrimaryCategory())
                .businessPhone(p.getBusinessPhone())
                .businessAddress(p.getBusinessAddress())
                .gstNumber(p.getGstNumber())
                .bankAccountName(p.getBankAccountName())
                .bankAccountNumber(p.getBankAccountNumber())
                .bankIfscCode(p.getBankIfscCode())
                .upiId(p.getUpiId())
                .whyDoYouWantToSell(p.getWhyDoYouWantToSell())
                .build();
    }

    private User currentUser() {
        return userById(AuthUtil.currentUserId());
    }

    private User userById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "User not found."));
    }
}