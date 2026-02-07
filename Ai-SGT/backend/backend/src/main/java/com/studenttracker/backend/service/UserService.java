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

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(Long id, User user) {
        Optional<User> existing = userRepository.findById(id);
        if (existing.isPresent()) {
            User u = existing.get();
            if (user.getUsername() != null)
                u.setUsername(user.getUsername());
            if (user.getEmail() != null)
                u.setEmail(user.getEmail());
            if (user.getPassword() != null)
                u.setPassword(user.getPassword());
            return userRepository.save(u);
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
