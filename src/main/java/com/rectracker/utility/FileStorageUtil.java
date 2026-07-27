package com.rectracker.utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Utility component for secure resume file storage, validation, path normalization,
 * and path traversal attack prevention.
 */
@Component
public class FileStorageUtil {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageUtil.class);

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".doc", ".docx", ".txt", ".rtf");
    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    private final Path uploadLocation;

    public FileStorageUtil() {
        this.uploadLocation = Paths.get("uploads/resumes").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadLocation);
        } catch (IOException e) {
            logger.error("Could not create resume upload directory at {}", this.uploadLocation, e);
            throw new RuntimeException("Could not create directory for upload storage", e);
        }
    }

    /**
     * Store uploaded file securely with sanitized unique filename.
     * Validates file size, extension, and filename safety.
     *
     * @param file the uploaded MultipartFile
     * @return the unique safe filename stored on disk
     * @throws IOException if I/O error occurs
     */
    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            logger.warn("File upload rejected: Size {} bytes exceeds limit of {} bytes", file.getSize(), MAX_FILE_SIZE_BYTES);
            throw new IllegalArgumentException("File size exceeds maximum permitted limit of 10 MB.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Original filename cannot be empty.");
        }

        // Sanitize & validate extension
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf(".");
        if (dotIndex != -1) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            logger.warn("File upload rejected: Disallowed extension '{}' in filename '{}'", extension, originalFilename);
            throw new IllegalArgumentException("Invalid file extension. Allowed formats: PDF, DOC, DOCX, TXT, RTF.");
        }

        String safeFileName = UUID.randomUUID().toString() + extension;
        Path targetLocation = getFilePath(safeFileName);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        }

        logger.info("File successfully stored: originalName='{}', storedName='{}'", originalFilename, safeFileName);
        return safeFileName;
    }

    /**
     * Resolves and normalizes the target file path while enforcing strict boundary checks
     * to prevent Path Traversal, Encoded Traversal, and Hidden File access.
     *
     * @param fileName target filename
     * @return normalized Path within upload boundary
     */
    public Path getFilePath(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("Filename cannot be null or empty.");
        }

        // Decode URL components if encoded (%2e%2e, %2f, %5c)
        String cleanedFileName = fileName.trim();
        if (cleanedFileName.contains("%") || cleanedFileName.contains("\0")) {
            logger.warn("SECURITY ALERT: Null byte or URL encoded characters in filename: {}", fileName);
            throw new SecurityException("Access denied: Invalid filename encoding.");
        }

        // Prevent traversal characters & hidden files
        if (cleanedFileName.contains("..") || cleanedFileName.contains("/") || cleanedFileName.contains("\\") || cleanedFileName.startsWith(".")) {
            logger.warn("SECURITY ALERT: Path traversal attack attempt with filename: {}", fileName);
            throw new SecurityException("Access denied: Invalid file path specified.");
        }

        Path targetPath = this.uploadLocation.resolve(cleanedFileName).normalize();

        // Enforce boundary check: Path must stay inside uploadLocation
        if (!targetPath.startsWith(this.uploadLocation)) {
            logger.warn("SECURITY ALERT: Resolved path '{}' broke out of boundary '{}'", targetPath, this.uploadLocation);
            throw new SecurityException("Access denied: Path traversal boundary violation.");
        }

        return targetPath;
    }

    /**
     * Safely deletes file if present.
     *
     * @param fileName filename to delete
     * @return true if deleted successfully, false otherwise
     */
    public boolean deleteFile(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return false;
        }
        try {
            Path filePath = getFilePath(fileName);
            return Files.deleteIfExists(filePath);
        } catch (Exception e) {
            logger.warn("Could not delete file '{}': {}", fileName, e.getMessage());
            return false;
        }
    }
}
