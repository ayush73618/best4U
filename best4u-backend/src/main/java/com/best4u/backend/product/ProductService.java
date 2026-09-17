package com.best4u.backend.product;

import java.util.List;

public interface ProductService {
    List<Product> listAll();
    Product create(Product product);
}
