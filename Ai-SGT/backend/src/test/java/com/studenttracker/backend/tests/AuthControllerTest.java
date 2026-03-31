package com.studenttracker.backend.tests;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studenttracker.backend.controller.AuthController;
import com.studenttracker.backend.dto.AuthResponse;
import com.studenttracker.backend.security.JwtAuthFilter;
import com.studenttracker.backend.security.JwtUtils;
import com.studenttracker.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@WebMvcTest(controllers = AuthController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    void postLoginWithValidCredentialsReturnsToken() throws Exception {
        when(authService.login(any())).thenReturn(new AuthResponse("jwt-token", "TEACHER", 1L, "Ava Sharma"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"teacher1@demo.com\",\"password\":\"teacher123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void postLoginWithWrongPasswordReturnsUnauthorized() throws Exception {
        when(authService.login(any())).thenThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"teacher1@demo.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postRegisterCreatesUserAndReturnsToken() throws Exception {
        when(authService.register(any())).thenReturn(new AuthResponse("register-token", "STUDENT", 3L, "Priya"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterPayload())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("register-token"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    private static class RegisterPayload {
        public String name = "Priya";
        public String email = "student1@demo.com";
        public String password = "student123";
        public String role = "STUDENT";
    }
}
