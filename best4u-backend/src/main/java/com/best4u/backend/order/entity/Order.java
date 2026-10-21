// entity/Order.java
package com.best4u.backend.order.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table named "customer_order", not "order" - ORDER is a reserved SQL
// keyword in Postgres (and most SQL dialects). Naming the table "order"
// would force every hand-written query to quote it and can break
// silently depending on the dialect's quoting behavior - easiest to
// just never collide with the keyword in the first place.
@Entity
@Table(name = "customer_order")
@Getter
@Setter
@NoArgsConstructor
public class Order extends BaseEntity {

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    private String razorpayOrderId;
    private String razorpayPaymentId;
}