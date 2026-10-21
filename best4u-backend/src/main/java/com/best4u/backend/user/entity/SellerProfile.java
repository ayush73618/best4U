package com.best4u.backend.user.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Separate entity from User so seller business details don't pollute
// the core account record. One-to-one with User via userId.
@Entity
@Table(name = "seller_profile")
@Getter
@Setter
@NoArgsConstructor
public class SellerProfile extends BaseEntity {

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private String shopName;

    @Column(nullable = false)
    private String businessType; // INDIVIDUAL, SMALL_BUSINESS, BRAND

    private String primaryCategory;
    private String businessPhone;
    private String businessAddress;
    private String gstNumber;

    // Bank details — stored for payout setup, not processed yet
    private String bankAccountName;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String upiId;

    @Column(columnDefinition = "TEXT")
    private String whyDoYouWantToSell;
}