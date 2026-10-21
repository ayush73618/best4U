package com.best4u.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SellerApplicationRequest {

    @NotBlank(message = "Shop name is required.")
    private String shopName;

    @NotBlank(message = "Business type is required.")
    private String businessType;

    private String primaryCategory;

    @NotBlank(message = "Business phone number is required.")
    private String businessPhone;

    private String businessAddress;
    private String gstNumber;

    private String bankAccountName;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String upiId;

    @NotBlank(message = "Tell us a little about why you want to sell on Best4U.")
    private String whyDoYouWantToSell;
}