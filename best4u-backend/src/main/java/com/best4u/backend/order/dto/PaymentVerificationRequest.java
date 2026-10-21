package com.best4u.backend.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// The three fields Razorpay's widget returns to the browser after a
// successful payment - sent here so the backend can verify the
// signature before ever marking an order PAID.
@Data
public class PaymentVerificationRequest {
    @NotBlank
    private String razorpayOrderId;

    @NotBlank
    private String razorpayPaymentId;

    @NotBlank
    private String razorpaySignature;
}