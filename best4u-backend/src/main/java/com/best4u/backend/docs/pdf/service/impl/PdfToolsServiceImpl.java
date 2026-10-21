package com.best4u.backend.docs.pdf.service.impl;

import com.best4u.backend.common.ApiException;
import com.best4u.backend.docs.pdf.service.PdfToolsService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.IOUtils;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfToolsServiceImpl implements PdfToolsService {

    @Override
    public byte[] mergePdfs(List<MultipartFile> files) throws IOException {
        PDFMergerUtility merger = new PDFMergerUtility();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        merger.setDestinationStream(out);

        for (MultipartFile file : files) {
            validatePdf(file);
            merger.addSource(new RandomAccessReadBuffer(file.getInputStream()));
        }

        merger.mergeDocuments(IOUtils.createMemoryOnlyStreamCache());
        return out.toByteArray();
    }

    @Override
    public byte[] splitPdfToZip(MultipartFile file) throws IOException {
        validatePdf(file);
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            Splitter splitter = new Splitter();
            List<PDDocument> pages = splitter.split(document);

            ByteArrayOutputStream zipOut = new ByteArrayOutputStream();
            try (ZipOutputStream zos = new ZipOutputStream(zipOut)) {
                int pageNum = 1;
                for (PDDocument page : pages) {
                    ByteArrayOutputStream pageOut = new ByteArrayOutputStream();
                    page.save(pageOut);
                    page.close();
                    zos.putNextEntry(new ZipEntry("page-" + pageNum + ".pdf"));
                    zos.write(pageOut.toByteArray());
                    zos.closeEntry();
                    pageNum++;
                }
            }
            return zipOut.toByteArray();
        }
    }

    @Override
    public byte[] compressPdf(MultipartFile file, float quality, float dpi) throws IOException {
        validatePdf(file);
        try (PDDocument original = Loader.loadPDF(file.getBytes());
             PDDocument compressed = new PDDocument()) {

            PDFRenderer renderer = new PDFRenderer(original);
            for (int i = 0; i < original.getNumberOfPages(); i++) {
                BufferedImage rendered = renderer.renderImageWithDPI(i, dpi, ImageType.RGB);
                PDRectangle size = original.getPage(i).getMediaBox();
                PDPage newPage = new PDPage(size);
                compressed.addPage(newPage);
                PDImageXObject pdImage = JPEGFactory.createFromImage(compressed, rendered, quality);
                try (PDPageContentStream contentStream = new PDPageContentStream(compressed, newPage)) {
                    contentStream.drawImage(pdImage, 0, 0, size.getWidth(), size.getHeight());
                }
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            compressed.save(out);
            return out.toByteArray();
        }
    }

    @Override
    public float[] resolveCompressionSettings(String level) {
        return switch (level.toLowerCase()) {
            case "high" -> new float[]{0.3f, 96f};
            case "low" -> new float[]{0.8f, 200f};
            default -> new float[]{0.5f, 150f};
        };
    }

    @Override
    public void validateMergeInput(List<MultipartFile> files) {
        if (files == null || files.size() < 2) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Upload at least two PDF files to merge.");
        }
    }

    private void validatePdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "That file appears to be empty.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "\"" + file.getOriginalFilename() + "\" isn't a PDF file.");
        }
    }
}
