package com.best4u.backend.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Best4UResponse<?>> handleApiException(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(Best4UResponse.error(ex.getMessage()));
    }

    // Fires when a @Valid @RequestBody fails Bean Validation constraints
    // (@NotBlank, @Size, @AssertTrue, etc.). Without this handler,
    // validation failures fell through to the generic 500 handler below
    // and reported as a server error instead of a client input problem.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Best4UResponse<?>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .orElse("Validation failed.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Best4UResponse.error(message));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Best4UResponse<?>> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(Best4UResponse.error("This file is larger than the allowed upload limit."));
    }

    // Unexpected exceptions: log the REAL detail server-side for
    // debugging, return a generic message to the client. ex.getMessage()
    // never reaches the response body - it previously did, which leaked
    // internal error detail (raw SQL errors, stack info, etc.) to callers.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Best4UResponse<?>> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Best4UResponse.error("Something went wrong on our end. Please try again."));
    }
}
