// dto/CategoryResponse.java
package com.best4u.backend.category.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CategoryResponse {
    Long id;
    String name;
    String slug;
}