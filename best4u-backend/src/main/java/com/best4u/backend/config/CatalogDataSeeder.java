package com.best4u.backend.config;

import com.best4u.backend.category.entity.Category;
import com.best4u.backend.category.repository.CategoryRepository;
import com.best4u.backend.product.entity.Product;
import com.best4u.backend.product.entity.ProductStatus;
import com.best4u.backend.product.repository.ProductRepository;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Seeds a realistic starter catalog across four categories on first run,
// so browsing/cart/checkout have real content to work against instead of
// an empty table. Only runs once - it checks whether any category
// already exists, so it never overwrites or duplicates real data on
// subsequent restarts.
@Component
public class CatalogDataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CatalogDataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        Category electronics = saveCategory("Electronics");
        Category home = saveCategory("Home");
        Category clothing = saveCategory("Clothing");
        Category grocery = saveCategory("Grocery");

        seedProduct("Wireless Earbuds", "Bluetooth 5.3, 30hr battery life", 1999.0, electronics.getId(), 50,
                "https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Smart Watch", "Heart rate & SpO2 monitoring, AMOLED display", 3499.0, electronics.getId(), 30,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Bluetooth Speaker", "Portable, waterproof, 12hr playback", 1499.0, electronics.getId(), 40,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Power Bank 20000mAh", "Fast charging, dual USB output", 999.0, electronics.getId(), 60,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");

        seedProduct("Cotton Bedsheet Set", "King size, 2 pillow covers included", 899.0, home.getId(), 45,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Non-stick Cookware Set", "5-piece, induction-friendly", 2499.0, home.getId(), 25,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("LED Table Lamp", "Adjustable brightness, USB rechargeable", 599.0, home.getId(), 35,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Storage Organizer Box", "Foldable, stackable, 45L capacity", 399.0, home.getId(), 50,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");

        seedProduct("Men's Cotton T-Shirt", "Regular fit, breathable fabric", 499.0, clothing.getId(), 100,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Women's Kurti", "A-line, printed cotton", 799.0, clothing.getId(), 80,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Denim Jeans", "Slim fit, stretchable", 1299.0, clothing.getId(), 60,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Running Shoes", "Lightweight mesh, cushioned sole", 1999.0, clothing.getId(), 40,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");

        seedProduct("Basmati Rice 5kg", "Aged, extra-long grain", 549.0, grocery.getId(), 70,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Organic Honey 500g", "Raw, unprocessed", 349.0, grocery.getId(), 55,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Assorted Dry Fruits 1kg", "Almonds, cashews, raisins mix", 899.0, grocery.getId(), 30,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
        seedProduct("Cold Pressed Coconut Oil 1L", "Chemical-free extraction", 399.0, grocery.getId(), 45,"https://placehold.co/400x400/e8e8e8/333333?text=Wireless+Earbuds");
    }

    private Category saveCategory(String name) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(name.toLowerCase());
        return categoryRepository.save(category);
    }

    private void seedProduct(String name, String description, double price, Long categoryId, int stock, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategoryId(categoryId);
        product.setStockQuantity(stock);
        product.setImageUrls(List.of(imageUrl));
        product.setStatus(ProductStatus.APPROVED); // seeded catalog items, not real seller submissions
        productRepository.save(product);
    }
}