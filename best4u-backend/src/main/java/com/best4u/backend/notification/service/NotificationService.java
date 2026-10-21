package com.best4u.backend.notification.service;

import com.best4u.backend.notification.dto.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void create(Long userId, String type, String message, String link);
    Page<NotificationResponse> listMine(Pageable pageable);
    long countUnread();
    void markAllRead();
}