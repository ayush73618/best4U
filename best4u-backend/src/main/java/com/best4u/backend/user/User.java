package com.best4u.backend.user;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "app_user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    // Optional — not every user provides one at registration.
    private String mobileNumber;

    private Instant createdAt = Instant.now();

    // No enforcement logic yet (nothing checks this at endpoints) — just
    // present on the model so the frontend has real data instead of
    // undefined, ready for when a role actually needs to gate something.
    @ElementCollection
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private List<String> roles = new ArrayList<>(List.of("USER"));
}