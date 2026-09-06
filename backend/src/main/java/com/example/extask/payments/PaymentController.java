package com.example.extask.payments;

import com.example.extask.service.EmailService;
import com.example.extask.service.PaymentService;
import com.example.extask.tasks.Task;
import com.example.extask.tasks.TaskRepository;
import com.example.extask.users.User;
import com.example.extask.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // POST /api/payments/create-order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Integer> body) {
        Integer taskId = body.get("taskId");
        if (taskId == null) {
            return ResponseEntity.badRequest().body("taskId is required");
        }

        Optional<Task> optTask = taskRepository.findById(taskId);
        if (optTask.isEmpty()) {
            return ResponseEntity.badRequest().body("Task not found");
        }
        Task task = optTask.get();

        if (!"SUBMITTED".equals(task.getStatus())) {
            return ResponseEntity.badRequest().body("Task must be in SUBMITTED status to pay");
        }

        // Call payment service to create Razorpay Order
        Payment transientPayment = paymentService.createtransaction(task.getBudget());
        if (transientPayment == null) {
            return ResponseEntity.status(500).body("Failed to create Razorpay transaction");
        }

        // Check if a payment record already exists for this task
        Optional<Payment> optPayment = paymentRepository.findByTaskId(taskId);
        Payment payment = optPayment.orElseGet(Payment::new);

        payment.setTaskId(taskId);
        payment.setAmount(task.getBudget());
        payment.setRazorpayOrderId(transientPayment.getRazorpayOrderId());
        payment.setStatus("PENDING");
        payment.setPaidAt(null);
        payment.setRazorpayPaymentId(null);

        Payment savedPayment = paymentRepository.save(payment);

        // Include the transient key/currency in response for the frontend SDK checkout
        savedPayment.setKey(transientPayment.getKey());
        savedPayment.setCurrency(transientPayment.getCurrency());

        return ResponseEntity.ok(savedPayment);
    }

    // POST /api/payments/confirm
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, String> body) {
        String razorpayOrderId = body.get("razorpayOrderId");
        String razorpayPaymentId = body.get("razorpayPaymentId");

        if (razorpayOrderId == null || razorpayPaymentId == null) {
            return ResponseEntity.badRequest().body("razorpayOrderId and razorpayPaymentId are required");
        }

        Optional<Payment> optPayment = paymentRepository.findByRazorpayOrderId(razorpayOrderId);
        if (optPayment.isEmpty()) {
            return ResponseEntity.badRequest().body("Payment record not found for Order ID: " + razorpayOrderId);
        }

        Payment payment = optPayment.get();
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setStatus("PAID");
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Update task status to PAID
        Optional<Task> optTask = taskRepository.findById(payment.getTaskId());
        if (optTask.isPresent()) {
            Task task = optTask.get();
            task.setStatus("PAID");
            taskRepository.save(task);

            // Send confirmation emails to poster and accepter
            Optional<User> optPoster = userRepository.findById(task.getPostedBy());
            Optional<User> optAccepter = Optional.empty();
            if (task.getAcceptedBy() != null) {
                optAccepter = userRepository.findById(task.getAcceptedBy());
            }

            if (optPoster.isPresent()) {
                User poster = optPoster.get();
                try {
                    System.out.println("Attempting to send payment email to poster: " + poster.getEmail());
                    emailService.sendPaymentPosterEmail(
                            poster.getEmail(),
                            poster.getName(),
                            task.getTitle(),
                            task.getBudget(),
                            task.getDeliveryType(),
                            razorpayPaymentId
                    );
                    System.out.println("Successfully sent payment email to poster: " + poster.getEmail());
                } catch (Exception e) {
                    System.err.println("Payment completed but confirmation email to poster failed: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            if (optAccepter.isPresent()) {
                User accepter = optAccepter.get();
                try {
                    System.out.println("Attempting to send payment email to accepter: " + accepter.getEmail());
                    emailService.sendPaymentAccepterEmail(
                            accepter.getEmail(),
                            accepter.getName(),
                            task.getTitle(),
                            task.getBudget(),
                            task.getDeliveryType(),
                            razorpayPaymentId
                    );
                    System.out.println("Successfully sent payment email to accepter: " + accepter.getEmail());
                } catch (Exception e) {
                    System.err.println("Payment completed but confirmation email to accepter failed: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        }

        return ResponseEntity.ok("Payment confirmed and task marked as PAID");
    }

    // GET /api/payments/getall (admin only)
    @GetMapping("/getall")
    public ResponseEntity<?> getAllPayments(@RequestParam("adminId") int adminId) {
        Optional<User> optAdmin = userRepository.findById(adminId);
        if (optAdmin.isEmpty() || !"ADMIN".equals(optAdmin.get().getRole())) {
            return ResponseEntity.status(403).body("Access denied. Admins only.");
        }
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(payments);
    }
}
