package com.best4u.backend.payment.service.impl;

import com.best4u.backend.payment.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public Order createOrder(double amountInRupees, String receiptId) throws Exception {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", Math.round(amountInRupees * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receiptId);

        // Lowercase "orders" - the SDK's field is client.orders, not
        // client.Orders. Confirmed against Razorpay's own GitHub SDK
        // source and integration docs rather than guessed a second time.
        return client.orders.create(orderRequest);
    }

    @Override
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws Exception {
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", razorpayOrderId);
        options.put("razorpay_payment_id", razorpayPaymentId);
        options.put("razorpay_signature", razorpaySignature);

        return Utils.verifyPaymentSignature(options, keySecret);
    }

    @Override
    public String publicKeyId() {
        return keyId;
    }
}