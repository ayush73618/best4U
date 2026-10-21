// entity/OrderItem.java
package com.best4u.backend.order.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_item")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem extends BaseEntity {

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Integer quantity;

    // A SNAPSHOT of Product.price at the moment of purchase, copied in
    // at checkout - never a live join/lookup. If the product's price
    // changes next month, every past order must keep showing what the
    // customer actually paid, not today's price. This is a domain rule,
    // not an optimization.
    @Column(nullable = false)
    private Double priceAtPurchase;
    
 // OrderItem.java — add
    @Column(nullable = false)
    private String productName;
    
    private String imageUrl; // nullable, snapshot of the product's image at purchase time
}