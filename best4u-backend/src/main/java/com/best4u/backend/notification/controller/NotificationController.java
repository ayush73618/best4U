package com.best4u.backend.notification.controller;

import com.best4u.backend.common.Best4UResponse;
import com.best4u.backend.notification.dto.NotificationResponse;
import com.best4u.backend.notification.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public Best4UResponse<Page<NotificationResponse>> list(
            @PageableDefault(size = 20) Pageable pageable) {
        return Best4UResponse.ok(notificationService.listMine(pageable));
    }

    @GetMapping("/unread-count")
    public Best4UResponse<Long> unreadCount() {
        return Best4UResponse.ok(notificationService.countUnread());
    }

    @PostMapping("/mark-read")
    public Best4UResponse<Void> markAllRead() {
        notificationService.markAllRead();
        return Best4UResponse.ok(null);
    }
}