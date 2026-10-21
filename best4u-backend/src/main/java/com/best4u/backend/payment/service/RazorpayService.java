// service/RazorpayService.java
package com.best4u.backend.payment.service;

import com.razorpay.Order;

public interface RazorpayService {
    Order createOrder(double amountInRupees, String receiptId) throws Exception;

    boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws Exception;

    // The PUBLISHABLE key id - safe to hand to the frontend, since
    // Razorpay's own checkout widget requires it client-side. Never
    // confuse this with the key SECRET, which stays server-side only
    // and is used solely inside this service.
    String publicKeyId();
}