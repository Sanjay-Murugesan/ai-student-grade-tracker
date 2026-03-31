package com.studenttracker.backend.service;

import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Creates a new user.
     * 
     * @param user the user to create
     * @return the saved user
     */
    public User createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        return userRepository.save(user);
    }

    /**
     * Retrieves a user by ID.
     * 
     * @param id the user ID
     * @return Optional containing the user if found
     */
    public Optional<User> getUserById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return userRepository.findById(id);
    }

    /**
     * Retrieves a user by username.
     * 
     * @param username the username
     * @return Optional containing the user if found
     */
    public Optional<User> getUserByUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return Optional.empty();
        }
        return userRepository.findByUsername(username);
    }

    /**
     * Retrieves a user by email.
     * 
     * @param email the email
     * @return Optional containing the user if found
     */
    public Optional<User> getUserByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        return userRepository.findByEmail(email);
    }

    /**
     * Retrieves all users.
     * 
     * @return list of all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Updates an existing user.
     * 
     * @param id          the user ID
     * @param userDetails the updated user details
     * @return the updated user
     * @throws RuntimeException if user not found
     */
    public User updateUser(Long id, User userDetails) {
        if (id == null || userDetails == null) {
            throw new IllegalArgumentException("ID and user details cannot be null");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userDetails.getUsername() != null) {
            user.setUsername(userDetails.getUsername());
        }
        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null) {
            user.setPasswordHash(userDetails.getPassword());
        }
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }

        return userRepository.save(user);
    }

    /**
     * Deletes a user by ID.
     * 
     * @param id the user ID
     */
    public void deleteUser(Long id) {
        if (id == null) {
            return;
        }
        userRepository.deleteById(id);
    }
}
