package com.best4u.backend.notification.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class NotificationResponse {
    Long id;
    String type;
    String message;
    String link;
    boolean isRead;
    Instant createdAt;
}