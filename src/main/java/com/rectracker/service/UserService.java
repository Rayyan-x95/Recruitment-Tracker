package com.rectracker.service;

import com.rectracker.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(User user);
    User authenticateUser(String username, String password);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByUsername(String username);
    List<User> getAllUsers();
}
