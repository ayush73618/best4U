package com.best4u.backend.work.note.entity;

import com.best4u.backend.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "note")
@Getter
@Setter
@NoArgsConstructor
public class Note extends BaseEntity {

    @Column(nullable = false)
    private Long userId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;
}
