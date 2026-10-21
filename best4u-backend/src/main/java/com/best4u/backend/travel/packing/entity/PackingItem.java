package com.best4u.backend.travel.packing.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "packing_item")
@Getter
@Setter
@NoArgsConstructor
public class PackingItem extends BaseEntity {

    @Column(nullable = false)
    private Long tripId;

    @Column(nullable = false)
    private String text;

    private boolean packed = false;
}
