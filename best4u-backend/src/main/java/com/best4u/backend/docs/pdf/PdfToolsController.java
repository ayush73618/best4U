package com.best4u.backend.docs.pdf;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/docs/pdf")
public class PdfToolsController {

    private final PdfToolsService pdfToolsService;

    public PdfToolsController(PdfToolsService pdfToolsService) {
        this.pdfToolsService = pdfToolsService;
    }

    @PostMapping("/merge")
    public ResponseEntity<byte[]> merge(@RequestParam("files") List<MultipartFile> files) throws IOException {
        pdfToolsService.validateMergeInput(files);
        return fileResponse(pdfToolsService.mergePdfs(files), "merged.pdf", MediaType.APPLICATION_PDF);
    }

    @PostMapping("/split")
    public ResponseEntity<byte[]> split(@RequestParam("file") MultipartFile file) throws IOException {
        return fileResponse(pdfToolsService.splitPdfToZip(file), "split-pages.zip", MediaType.valueOf("application/zip"));
    }

    @PostMapping("/compress")
    public ResponseEntity<byte[]> compress(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "medium") String level
    ) throws IOException {
        float[] settings = pdfToolsService.resolveCompressionSettings(level);
        byte[] result = pdfToolsService.compressPdf(file, settings[0], settings[1]);
        return fileResponse(result, "compressed.pdf", MediaType.APPLICATION_PDF);
    }

    private ResponseEntity<byte[]> fileResponse(byte[] content, String filename, MediaType type) {
        return ResponseEntity.ok()
                .contentType(type)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(content);
    }
}