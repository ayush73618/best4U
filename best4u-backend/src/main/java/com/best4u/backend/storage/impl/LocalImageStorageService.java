package com.best4u.backend.storage.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.storage.ImageStorageService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// Local-disk implementation, deliberately isolated behind the
// ImageStorageService interface - swapping to Cloudinary/S3 later means
// writing one new class and changing zero callers, not a rewrite. Known
// limitation, stated plainly: files here don't survive a redeploy to a
// fresh container - fine for building/testing, not for production.
@Service
public class LocalImageStorageService implements ImageStorageService {

    @Value("${best4u.upload.dir}")
    private String uploadDir;

    @Value("${best4u.upload.public-path}")
    private String publicPath;

    @Override
    public List<String> storeAll(List<MultipartFile> files) throws IOException {
      if (files == null || files.isEmpty()) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "At least one image is required.");
      }
      // No upper cap — sellers can upload as many images as their
      // product needs. Storage cost is a production concern, not a
      // hard-coded limit in the business logic.
      List<String> urls = new ArrayList<>();
      for (MultipartFile file : files) {
        urls.add(storeOne(file));
      }
      return urls;
    }

    private String storeOne(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "One of the uploaded files is empty.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "\"" + file.getOriginalFilename() + "\" isn't an image file.");
        }

        Path dir = Path.of(uploadDir);
        Files.createDirectories(dir);

        String filename = UUID.randomUUID() + extensionOf(file.getOriginalFilename());
        Files.copy(file.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        // Returns a path RELATIVE to this server, not a full URL - the
        // backend never hardcodes its own external host. The frontend
        // owns combining this with its own environment-specific origin
        // (see resolveImageUrl on the Angular side).
        return publicPath + "/" + filename;
    }

    private String extensionOf(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "";
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}