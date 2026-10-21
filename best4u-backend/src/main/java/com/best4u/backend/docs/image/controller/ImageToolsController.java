package com.best4u.backend.docs.image.controller;

import com.best4u.backend.docs.image.service.ImageToolsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/docs/image")
public class ImageToolsController {

    private final ImageToolsService imageToolsService;

    public ImageToolsController(ImageToolsService imageToolsService) {
        this.imageToolsService = imageToolsService;
    }

    @PostMapping("/process")
    public ResponseEntity<byte[]> process(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "jpg") String format,
            @RequestParam(defaultValue = "80") int quality,
            @RequestParam(required = false) Integer maxWidth
    ) throws IOException {
        byte[] result = imageToolsService.processImage(file, format, quality, maxWidth);
        boolean isPng = "png".equalsIgnoreCase(format);
        return ResponseEntity.ok()
                .contentType(isPng ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"processed." + (isPng ? "png" : "jpg") + "\"")
                .body(result);
    }
}
