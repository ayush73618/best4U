package com.best4u.backend.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Every controller in the app returns this same envelope, so the Angular
// frontend can handle success/error uniformly regardless of which module
// (auth, product, work...) the response came from.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Best4UResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> Best4UResponse<T> ok(T data) {
        return new Best4UResponse<>(true, "OK", data);
    }

    public static <T> Best4UResponse<T> ok(String message, T data) {
        return new Best4UResponse<>(true, message, data);
    }

    public static <T> Best4UResponse<T> error(String message) {
        return new Best4UResponse<>(false, message, null);
    }
}
