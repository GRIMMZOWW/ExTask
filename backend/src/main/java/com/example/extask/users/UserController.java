package com.example.extask.users;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = userService.register(user);
            if (saved == null) {
                return ResponseEntity.badRequest().body("Registration failed. Please try again.");
            }
            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("name", saved.getName());
            response.put("email", saved.getEmail());
            response.put("role", saved.getRole());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed. Please check your inputs.");
        }
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request, HttpServletResponse response) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Please enter email and password.");
        }

        User user = userService.login(email, password);
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        // Establish Spring Security context and Session
        String roleName = "ROLE_" + (user.getRole() != null ? user.getRole().toUpperCase() : "USER");
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            user.getEmail(),
            null,
            Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("id", user.getId());
        responseBody.put("name", user.getName());
        responseBody.put("email", user.getEmail());
        responseBody.put("role", user.getRole());
        return ResponseEntity.ok(responseBody);
    }

    // POST /api/users/logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    // POST /api/users/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Please enter your email.");
        }
        boolean sent = userService.forgotPassword(email.trim());
        if (!sent) {
            return ResponseEntity.badRequest().body("Email not found");
        }
        return ResponseEntity.ok("OTP sent to your email");
    }

    // POST /api/users/verify-otp
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required.");
        }
        boolean valid = userService.verifyOtp(email.trim(), otp.trim());
        if (!valid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
        return ResponseEntity.ok("OTP verified");
    }

    // POST /api/users/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        if (email == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body("All fields are required.");
        }

        try {
            boolean reset = userService.resetPassword(email.trim(), otp.trim(), newPassword);
            if (!reset) {
                return ResponseEntity.badRequest().body("Failed to reset password. Invalid or expired OTP.");
            }
            return ResponseEntity.ok("Password reset successful");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to reset password.");
        }
    }

    // GET /api/users/getall (admin only, verified via Spring Security and parameter)
    @GetMapping("/getall")
    public ResponseEntity<?> getAllUsers(@RequestParam(value = "adminId", required = false, defaultValue = "0") int adminId) {
        List<User> users = userService.getAllUsers();
        // Mask passwords before returning
        for (User u : users) {
            u.setPassword("••••••••");
            u.setOtp(null);
        }
        return ResponseEntity.ok(users);
    }

    // PUT /api/users/update/{id}
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") int id, @RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        if (name == null || name.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name and email are required");
        }
        try {
            User updated = userService.updateUser(id, name.trim(), email.trim());
            if (updated == null) {
                return ResponseEntity.status(404).body("User not found");
            }
            Map<String, Object> response = new HashMap<>();
            response.put("id", updated.getId());
            response.put("name", updated.getName());
            response.put("email", updated.getEmail());
            response.put("role", updated.getRole());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while updating the profile");
        }
    }
}
