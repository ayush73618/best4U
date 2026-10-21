package com.best4u.backend.product.repository;

import com.best4u.backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :qty " +
           "WHERE p.id = :id AND p.stockQuantity >= :qty")
    int decrementStockIfAvailable(@Param("id") Long id, @Param("qty") int qty);

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity + :qty WHERE p.id = :id")
    void incrementStock(@Param("id") Long id, @Param("qty") int qty);
}