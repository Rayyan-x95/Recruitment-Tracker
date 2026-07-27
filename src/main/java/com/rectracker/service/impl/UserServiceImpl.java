package com.rectracker.service.impl;

import com.rectracker.dao.UserDAO;
import com.rectracker.exception.AuthenticationException;
import com.rectracker.exception.ValidationException;
import com.rectracker.model.User;
import com.rectracker.service.UserService;
import com.rectracker.utility.PasswordUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementation of UserService managing registration, BCrypt authentication,
 * and automatic seamless legacy password hash migration.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserDAO userDAO, PasswordEncoder passwordEncoder) {
        this.userDAO = userDAO;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user) {
        if (userDAO.existsByUsername(user.getUsername())) {
            throw new ValidationException("Username '" + user.getUsername() + "' is already taken.");
        }
        if (userDAO.existsByEmail(user.getEmail())) {
            throw new ValidationException("Email '" + user.getEmail() + "' is already registered.");
        }

        // Hash password using BCrypt
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDAO.save(user);
    }

    @Override
    public User authenticateUser(String username, String password) {
        User user = userDAO.findByUsername(username)
                .orElseThrow(() -> new AuthenticationException("Invalid username or password."));

        String storedHash = user.getPassword();

        // Automatic Password Migration: Check for legacy SHA-256 hash
        if (PasswordUtil.isLegacySha256(storedHash)) {
            if (PasswordUtil.matchLegacySha256(password, storedHash)) {
                // Legacy match success -> Re-hash with BCrypt & update DB immediately
                String bcryptHash = passwordEncoder.encode(password);
                user.setPassword(bcryptHash);
                userDAO.save(user);
                logger.info("Successfully migrated legacy SHA-256 hash to BCrypt for user '{}'", username);
                return user;
            } else {
                throw new AuthenticationException("Invalid username or password.");
            }
        }

        // Standard BCrypt Verification
        if (!passwordEncoder.matches(password, storedHash)) {
            throw new AuthenticationException("Invalid username or password.");
        }

        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userDAO.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        return userDAO.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }
}
