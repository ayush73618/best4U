package com.best4u.backend.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface ImageStorageService {
    List<String> storeAll(List<MultipartFile> files) throws IOException;
}