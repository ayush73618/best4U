package com.best4u.backend.config;

import com.best4u.backend.user.entity.User;
import com.best4u.backend.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Solves the RBAC bootstrapping problem: an admin can only be created by
// an existing admin, so the very first one can't come from the app
// itself. Runs once on startup; does nothing if the configured admin
// email already exists.
@Component
@Order(1) // runs before CatalogDataSeeder, though the two don't depend on each other
public class AdminBootstrapSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${best4u.admin.email}")
    private String adminEmail;

    @Value("${best4u.admin.password}")
    private String adminPassword;

    public AdminBootstrapSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = new User();
        admin.setFirstName("Best4U");
        admin.setLastName("Admin");
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.getRoles().add("ADMIN");
        userRepository.save(admin);
    }
}