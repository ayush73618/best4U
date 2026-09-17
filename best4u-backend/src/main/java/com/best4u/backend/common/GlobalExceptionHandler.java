package com.best4u.backend.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Best4UResponse<?>> handleApiException(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(Best4UResponse.error(ex.getMessage()));
    }

    // Without this, a file exceeding spring.servlet.multipart.max-file-size
    // fell through to the generic 500 handler below, which is misleading -
    // it's a client mistake (too-large file), not a server failure.
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Best4UResponse<?>> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(Best4UResponse.error("This file is larger than the allowed upload limit."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Best4UResponse<?>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Best4UResponse.error("Something went wrong: " + ex.getMessage()));
    }
}