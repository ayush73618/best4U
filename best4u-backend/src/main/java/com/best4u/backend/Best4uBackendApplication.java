package com.best4u.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Single entry point for the whole backend. Everything - auth, product,
// work (todos/notes/habits), and every future domain (money, docs, code,
// travel...) - runs inside this one application. No Eureka, no Gateway:
// there is only one deployable service, so there is nothing to discover
// and nothing to route between.
@SpringBootApplication
public class Best4uBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(Best4uBackendApplication.class, args);
    }
}
