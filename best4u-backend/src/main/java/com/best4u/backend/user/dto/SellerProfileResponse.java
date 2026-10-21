package com.best4u.backend.user.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SellerProfileResponse {
    String shopName;
    String businessType;
    String primaryCategory;
    String businessPhone;
    String businessAddress;
    String gstNumber;
    String bankAccountName;
    String bankAccountNumber;
    String bankIfscCode;
    String upiId;
    String whyDoYouWantToSell;
}