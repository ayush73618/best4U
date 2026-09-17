package com.best4u.backend.security;

import com.best4u.backend.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;

// Small helper any service in any module calls to find out "who is
// making this request" - reads the userId JwtAuthFilter placed on the
// security context. Throws if called on an unauthenticated request.
public class AuthUtil {
    private AuthUtil() {}

    public static Long currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof Long)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Not authenticated.");
        }
        return (Long) auth.getPrincipal();
    }
}
