package com.rectracker.utility;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Utility component for password encoding, BCrypt matching, and legacy SHA-256 migration support.
 */
public class PasswordUtil {

    private static final PasswordEncoder BCRYPT_ENCODER = new BCryptPasswordEncoder(10);

    /**
     * Hashes raw password using BCrypt with work factor 10.
     *
     * @param password raw plaintext password
     * @return BCrypt hashed password string
     */
    public static String hashPassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        return BCRYPT_ENCODER.encode(password);
    }

    /**
     * Matches raw password against BCrypt hashed password.
     *
     * @param rawPassword raw plaintext password
     * @param hashedPassword stored BCrypt hash
     * @return true if password matches, false otherwise
     */
    public static boolean matchPassword(String rawPassword, String hashedPassword) {
        if (rawPassword == null || hashedPassword == null) {
            return false;
        }
        return BCRYPT_ENCODER.matches(rawPassword, hashedPassword);
    }

    /**
     * Checks whether stored hash is a legacy SHA-256 hash.
     * BCrypt hashes start with $2a$, $2b$, or $2y$.
     *
     * @param storedHash stored password hash
     * @return true if legacy hash, false if BCrypt
     */
    public static boolean isLegacySha256(String storedHash) {
        if (storedHash == null || storedHash.isBlank()) {
            return false;
        }
        return !storedHash.startsWith("$2a$") && !storedHash.startsWith("$2b$") && !storedHash.startsWith("$2y$");
    }

    /**
     * Matches raw password against legacy SHA-256 hash.
     *
     * @param rawPassword raw plaintext password
     * @param legacyHash legacy SHA-256 hash
     * @return true if raw password matches legacy hash
     */
    public static boolean matchLegacySha256(String rawPassword, String legacyHash) {
        if (rawPassword == null || legacyHash == null) {
            return false;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            String calculatedHash = Base64.getEncoder().encodeToString(hashBytes);
            return calculatedHash.equals(legacyHash);
        } catch (NoSuchAlgorithmException e) {
            return false;
        }
    }
}
