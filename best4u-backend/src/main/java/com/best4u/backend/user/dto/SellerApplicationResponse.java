package com.best4u.backend.user.dto;

import com.best4u.backend.user.entity.SellerStatus;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SellerApplicationResponse {
    Long userId;
    String firstName;
    String lastName;
    String email;
    SellerStatus sellerStatus;

    // Seller profile details — null if not yet submitted
    String shopName;
    String businessType;
    String primaryCategory;
    String businessPhone;
    String businessAddress;
    String gstNumber;
    String whyDoYouWantToSell;
}