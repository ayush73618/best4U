package com.best4u.backend.travel.itinerary.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "itinerary_item")
@Getter
@Setter
@NoArgsConstructor
public class ItineraryItem extends BaseEntity {

    @Column(nullable = false)
    private Long tripId;

    @Column(nullable = false)
    private Integer day;

    private String time;

    @Column(nullable = false)
    private String title;

    private String notes;
}
