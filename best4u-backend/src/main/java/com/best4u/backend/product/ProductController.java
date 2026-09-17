package com.best4u.backend.product;

import com.best4u.backend.common.Best4UResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Best4UResponse<List<Product>> list() {
        return Best4UResponse.ok(productService.listAll());
    }

    // Authenticated (see SecurityConfig: only GET /products/** is public).
    // TODO before going live: restrict this to an admin role, not any
    // logged-in user.
    @PostMapping
    public Best4UResponse<Product> create(@RequestBody Product product) {
        return Best4UResponse.ok("Product created.", productService.create(product));
    }
}
