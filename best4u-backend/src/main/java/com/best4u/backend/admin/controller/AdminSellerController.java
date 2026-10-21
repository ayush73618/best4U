package com.best4u.backend.admin.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.user.dto.SellerApplicationResponse;
import com.best4u.backend.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/sellers")
public class AdminSellerController {

    private final UserService userService;

    public AdminSellerController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/pending")
    public Best4UResponse<List<SellerApplicationResponse>> pending() {
        return Best4UResponse.ok(userService.listPendingSellers());
    }

    @PutMapping("/{userId}/approve")
    public Best4UResponse<Void> approve(@PathVariable Long userId) {
        userService.approveSeller(userId);
        return Best4UResponse.ok("Seller approved.", null);
    }

    @PutMapping("/{userId}/reject")
    public Best4UResponse<Void> reject(@PathVariable Long userId) {
        userService.rejectSeller(userId);
        return Best4UResponse.ok("Application rejected.", null);
    }
}