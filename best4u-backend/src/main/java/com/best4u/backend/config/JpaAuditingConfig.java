package com.best4u.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// Activates @CreatedDate/@LastModifiedDate app-wide. Without this
// annotation present somewhere in the app, BaseEntity's timestamp fields
// would silently stay null on every entity that extends it.
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
