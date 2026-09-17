package com.best4u.backend.docs.image;

import com.best4u.backend.common.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

@Service
public class ImageToolsService {

    public byte[] processImage(MultipartFile file, String targetFormat, int quality, Integer maxWidth) throws IOException {
        
    	if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "That file appears to be empty.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "\"" + file.getOriginalFilename() + "\" isn't an image file.");
        }

    	BufferedImage original = ImageIO.read(file.getInputStream());
        if (original == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Could not read this file as an image.");
        }

        BufferedImage working = (maxWidth != null && original.getWidth() > maxWidth)
                ? resize(original, maxWidth)
                : original;

        boolean toJpeg = !"png".equalsIgnoreCase(targetFormat);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        if (toJpeg) {
            // JPEG has no transparency channel - flatten onto white first,
            // or transparent areas would render as black instead.
            BufferedImage rgbImage = new BufferedImage(working.getWidth(), working.getHeight(), BufferedImage.TYPE_INT_RGB);
            rgbImage.createGraphics().drawImage(working, 0, 0, Color.WHITE, null);

            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
            ImageWriter writer = writers.next();
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(quality / 100f);

            try (ImageOutputStream ios = ImageIO.createImageOutputStream(out)) {
                writer.setOutput(ios);
                writer.write(null, new IIOImage(rgbImage, null, null), param);
            } finally {
                writer.dispose();
            }
        } else {
            ImageIO.write(working, "png", out);
        }

        return out.toByteArray();
    }

    private BufferedImage resize(BufferedImage original, int maxWidth) {
        int newHeight = (int) ((double) original.getHeight() / original.getWidth() * maxWidth);
        BufferedImage resized = new BufferedImage(maxWidth, newHeight, BufferedImage.TYPE_INT_ARGB);

        Graphics2D g = resized.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(original, 0, 0, maxWidth, newHeight, null);
        g.dispose();

        return resized;
    }
}