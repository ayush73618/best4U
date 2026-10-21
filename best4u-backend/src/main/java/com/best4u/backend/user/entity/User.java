package com.best4u.backend.user.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String mobileNumber;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = new ArrayList<>(List.of("USER"));
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SellerStatus sellerStatus = SellerStatus.NONE;
}
