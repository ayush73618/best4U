// entity/OrderStatus.java
package com.best4u.backend.order.entity;

// A real state machine, not a boolean flag - PENDING is the only status
// checkout can create; PAID/FAILED are set only after Razorpay's
// signature is verified; CANCELLED/SHIPPED/DELIVERED are here for the
// fulfillment flow, not yet driven by any endpoint.
public enum OrderStatus {
    PENDING,
    PAID,
    FAILED,
    CANCELLED,
    SHIPPED,
    DELIVERED
}