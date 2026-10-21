// entity/CartItem.java
package com.best4u.backend.cart.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cart_item", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "productId"}))
@Getter
@Setter
@NoArgsConstructor
public class CartItem extends BaseEntity {

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Integer quantity;
}