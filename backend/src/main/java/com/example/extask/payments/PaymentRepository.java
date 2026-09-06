package com.example.extask.payments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByTaskId(int taskId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}
