package com.best4u.backend.order.dto;

import lombok.Builder;
import lombok.Value;

// Everything the frontend needs to open Razorpay's Checkout.js widget
// right after checkout succeeds.
@Value
@Builder
public class CheckoutResponse {
    Long orderId;
    String razorpayOrderId;
    String razorpayKeyId;
    Double amount;
}