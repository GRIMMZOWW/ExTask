package com.example.extask.users;

import com.example.extask.service.EmailService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.regex.Pattern;

@Service
public class UserService {

    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{3,30}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Startup migration for legacy plaintext passwords (e.g. demo accounts)
    @PostConstruct
    public void migrateLegacyPasswords() {
        try {
            List<User> allUsers = userRepository.findAll();
            for (User user : allUsers) {
                String pwd = user.getPassword();
                if (pwd != null && !isBCryptHash(pwd)) {
                    System.out.println("Migrating legacy plaintext password to BCrypt for user ID: " + user.getId());
                    user.setPassword(passwordEncoder.encode(pwd));
                    userRepository.save(user);
                }
            }
        } catch (Exception e) {
            System.err.println("Note: Legacy password migration skipped or table not initialized yet: " + e.getMessage());
        }
    }

    private boolean isBCryptHash(String password) {
        if (password == null) return false;
        return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
    }

    // Name validation (3-30 chars, alphanumeric/underscore, no spaces)
    public void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required.");
        }
        String trimmed = name.trim();
        if (trimmed.contains(" ")) {
            throw new IllegalArgumentException("Name cannot contain spaces. Use a single handle or username without spaces.");
        }
        if (trimmed.length() < 3 || trimmed.length() > 30 || !NAME_PATTERN.matcher(trimmed).matches()) {
            throw new IllegalArgumentException("Name must be 3 to 30 characters and contain only letters, numbers, and underscores (no spaces).");
        }
    }

    // Email validation
    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty() || !EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException("Please enter a valid email address.");
        }
    }

    // Password validation (8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    public void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Use 8+ characters with uppercase, lowercase, a number and a special character.");
        }
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else hasSpecial = true;
        }

        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            throw new IllegalArgumentException("Use 8+ characters with uppercase, lowercase, a number and a special character.");
        }
    }

    // Register a new user
    public User register(User user) {
        validateName(user.getName());
        validateEmail(user.getEmail());
        validatePassword(user.getPassword());

        String trimmedEmail = user.getEmail().trim().toLowerCase();
        Optional<User> existing = userRepository.findByEmail(trimmedEmail);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        user.setName(user.getName().trim());
        user.setEmail(trimmedEmail);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        User saved = userRepository.save(user);

        try {
            System.out.println("Attempting to send welcome email to registered user: " + saved.getEmail());
            emailService.sendWelcomeEmail(saved.getEmail(), saved.getName());
            System.out.println("Successfully sent welcome email to registered user: " + saved.getEmail());
        } catch (Exception e) {
            System.err.println("Welcome email failed for newly registered user: " + e.getMessage());
            e.printStackTrace();
        }

        return saved;
    }

    // Login with BCrypt verification and fallback seamless migration
    public User login(String email, String rawPassword) {
        if (email == null || rawPassword == null) {
            return null;
        }
        String trimmedEmail = email.trim().toLowerCase();
        Optional<User> optUser = userRepository.findByEmail(trimmedEmail);
        if (optUser.isEmpty()) {
            return null;
        }

        User user = optUser.get();
        String storedPassword = user.getPassword();

        if (storedPassword == null) {
            return null;
        }

        if (isBCryptHash(storedPassword)) {
            if (passwordEncoder.matches(rawPassword, storedPassword)) {
                return user;
            }
        } else {
            // Legacy plaintext fallback check
            if (storedPassword.equals(rawPassword)) {
                // Upgrade to BCrypt immediately
                user.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(user);
                return user;
            }
        }

        return null;
    }

    // Forgot password — generate OTP and email it
    public boolean forgotPassword(String email) {
        if (email == null) return false;
        String trimmedEmail = email.trim().toLowerCase();
        Optional<User> optUser = userRepository.findByEmail(trimmedEmail);
        if (optUser.isEmpty()) {
            return false;
        }
        User user = optUser.get();
        String otp = String.valueOf(100000 + new Random().nextInt(900000)); // 6-digit OTP
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        try {
            System.out.println("Attempting to send OTP email to user: " + user.getEmail());
            emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);
            System.out.println("Successfully sent OTP email to user: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("OTP email sending failed: " + e.getMessage());
            e.printStackTrace();
            // Fallback simple mail message
            emailService.sendemail(
                user.getEmail(),
                "Your ExTask verification code",
                "Your OTP for password reset is: " + otp + "\nThis OTP is valid for 10 minutes."
            );
        }
        return true;
    }

    // Verify OTP
    public boolean verifyOtp(String email, String otp) {
        if (email == null || otp == null) return false;
        String trimmedEmail = email.trim().toLowerCase();
        Optional<User> optUser = userRepository.findByEmail(trimmedEmail);
        if (optUser.isEmpty()) {
            return false;
        }
        User user = optUser.get();
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return false;
        }
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return false; // OTP expired
        }
        return user.getOtp().equals(otp.trim());
    }

    // Reset password (after OTP verified)
    public boolean resetPassword(String email, String otp, String newPassword) {
        validatePassword(newPassword);
        if (!verifyOtp(email, otp)) {
            return false;
        }
        String trimmedEmail = email.trim().toLowerCase();
        Optional<User> optUser = userRepository.findByEmail(trimmedEmail);
        if (optUser.isEmpty()) {
            return false;
        }
        User user = optUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        return true;
    }

    // Get all users (admin)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    // Update user profile fields (editable: name and email)
    public User updateUser(int id, String name, String email) {
        validateName(name);
        validateEmail(email);

        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isEmpty()) {
            return null;
        }
        User user = optUser.get();
        String trimmedEmail = email.trim().toLowerCase();

        // If email is changing, ensure the new email is not already taken
        if (!user.getEmail().equalsIgnoreCase(trimmedEmail)) {
            Optional<User> existing = userRepository.findByEmail(trimmedEmail);
            if (existing.isPresent()) {
                throw new IllegalArgumentException("Email already taken");
            }
        }

        user.setName(name.trim());
        user.setEmail(trimmedEmail);
        return userRepository.save(user);
    }
}
