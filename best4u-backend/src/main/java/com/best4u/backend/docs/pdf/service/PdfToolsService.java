package com.best4u.backend.docs.pdf.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PdfToolsService {
    byte[] mergePdfs(List<MultipartFile> files) throws IOException;
    byte[] splitPdfToZip(MultipartFile file) throws IOException;
    byte[] compressPdf(MultipartFile file, float quality, float dpi) throws IOException;
    float[] resolveCompressionSettings(String level);
    void validateMergeInput(List<MultipartFile> files);
}
