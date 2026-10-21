// repository/CategoryRepository.java
package com.best4u.backend.category.repository;

import com.best4u.backend.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsBySlug(String slug);
}