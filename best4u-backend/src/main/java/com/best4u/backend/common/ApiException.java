package com.best4u.backend.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

// Thrown anywhere in the app (any module) when a request can't be
// fulfilled for a known reason - caught once, centrally, by
// GlobalExceptionHandler instead of every controller writing its own
// try/catch.
@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
