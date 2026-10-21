package com.best4u.backend.docs.image.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageToolsService {
    byte[] processImage(MultipartFile file, String targetFormat, int quality, Integer maxWidth) throws IOException;
}
