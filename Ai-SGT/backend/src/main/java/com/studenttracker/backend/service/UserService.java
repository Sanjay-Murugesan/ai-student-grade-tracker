package com.studenttracker.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studenttracker.backend.entity.User;
import com.studenttracker.backend.entity.UserRole;
import com.studenttracker.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String TOKEN_PREFIX = "Bearer ";
    private static final long TOKEN_TTL_SECONDS = 60L * 60L * 8L;
    private static final String SECRET = "ai-sgt-local-development-secret-change-before-production";

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public UserService(UserRepository userRepository, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
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

    public Optional<User> getUserByUsernameOrEmail(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            return Optional.empty();
        }
        String value = identifier.trim();
        return userRepository.findByUsernameOrEmail(value, value);
    }

    public Optional<User> authenticate(String identifier, String password, String role) {
        if (password == null || password.isBlank() || role == null || role.isBlank()) {
            return Optional.empty();
        }

        UserRole requestedRole;
        try {
            requestedRole = UserRole.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }

        return getUserByUsernameOrEmail(identifier)
                .filter(user -> user.getPassword().equals(password))
                .filter(user -> user.getRole() == requestedRole);
    }

    public String generateToken(User user) {
        try {
            Map<String, Object> header = new LinkedHashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", user.getId());
            payload.put("username", user.getUsername());
            payload.put("email", user.getEmail());
            payload.put("role", user.getRole().toString());
            payload.put("iat", Instant.now().getEpochSecond());
            payload.put("exp", Instant.now().plusSeconds(TOKEN_TTL_SECONDS).getEpochSecond());

            String encodedHeader = encodeJson(header);
            String encodedPayload = encodeJson(payload);
            String signature = sign(encodedHeader + "." + encodedPayload);
            return encodedHeader + "." + encodedPayload + "." + signature;
        } catch (Exception ex) {
            throw new IllegalStateException("Could not create auth token", ex);
        }
    }

    public Optional<User> getUserFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_PREFIX)) {
            return Optional.empty();
        }
        return verifyToken(authorizationHeader.substring(TOKEN_PREFIX.length()));
    }

    public Optional<User> verifyToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return Optional.empty();
            }

            String expectedSignature = sign(parts[0] + "." + parts[1]);
            if (!MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                return Optional.empty();
            }

            byte[] payloadBytes = Base64.getUrlDecoder().decode(parts[1]);
            Map<String, Object> payload = objectMapper.readValue(payloadBytes, new TypeReference<>() {});
            Number exp = (Number) payload.get("exp");
            Number sub = (Number) payload.get("sub");
            String role = (String) payload.get("role");

            if (exp == null || sub == null || exp.longValue() < Instant.now().getEpochSecond()) {
                return Optional.empty();
            }

            return userRepository.findById(sub.longValue())
                    .filter(user -> user.getRole().toString().equals(role));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }

    private String encodeJson(Map<String, Object> value) throws Exception {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(objectMapper.writeValueAsBytes(value));
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance(HMAC_ALGORITHM);
        mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
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
            user.setPassword(userDetails.getPassword());
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
