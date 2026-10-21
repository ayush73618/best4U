package com.best4u.backend.travel.specification;

import com.best4u.backend.travel.entity.Trip;
import org.springframework.data.jpa.domain.Specification;

public class TripSpecifications {

    private TripSpecifications() {}

    public static Specification<Trip> belongsToUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<Trip> nameOrDestinationContains(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return (root, query, cb) -> cb.conjunction();
        }
        String pattern = "%" + keyword.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("destination")), pattern)
        );
    }
}
