package com.best4u.backend.notification.service.impl;

import com.best4u.backend.notification.dto.NotificationResponse;
import com.best4u.backend.notification.entity.Notification;
import com.best4u.backend.notification.repository.NotificationRepository;
import com.best4u.backend.notification.service.NotificationService;
import com.best4u.backend.security.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public void create(Long userId, String type, String message, String link) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setMessage(message);
        n.setLink(link);
        notificationRepository.save(n);
    }

    @Override
    public Page<NotificationResponse> listMine(Pageable pageable) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(AuthUtil.currentUserId(), pageable)
                .map(this::toResponse);
    }

    @Override
    public long countUnread() {
        return notificationRepository.countByUserIdAndIsReadFalse(AuthUtil.currentUserId());
    }

    @Override
    @Transactional
    public void markAllRead() {
        notificationRepository.markAllReadForUser(AuthUtil.currentUserId());
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .link(n.getLink())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}