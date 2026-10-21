package com.best4u.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

// Without @EnableScheduling somewhere in the app, @Scheduled methods
// (like AbandonedOrderCleanupJob) are silently never invoked - Spring
// doesn't run them by default.
@Configuration
@EnableScheduling
public class SchedulingConfig {
}