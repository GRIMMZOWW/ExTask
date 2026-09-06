package com.example.extask.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailsender;

    // Backward compatible simple mail message sender
    public void sendemail(String to, String Subject, String message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(to);
            mail.setSubject(Subject);
            mail.setText(message);
            mail.setFrom("thejoyboy3553@gmail.com");
            mailsender.send(mail);
        } catch (Exception e) {
            System.err.println("Simple sendemail failed: " + e.getMessage());
        }
    }

    // Helper method to send MIME HTML emails
    private void sendHtmlEmail(String to, String subject, String contentHtml, String contentText) 
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailsender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setFrom("thejoyboy3553@gmail.com", "ExTask Exchange");

        // Professional ExTask HTML Email Template (Step 7)
        String htmlTemplate = 
            "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "  <meta charset=\"utf-8\">\n" +
            "  <style>\n" +
            "    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; }\n" +
            "    .wrapper { background-color: #f4f4f5; padding: 40px 20px; }\n" +
            "    .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }\n" +
            "    .header { padding: 24px 32px; border-bottom: 1px solid #e4e4e7; background-color: #ffffff; }\n" +
            "    .logo { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }\n" +
            "    .logo-ex { color: #0f172a; }\n" +
            "    .logo-task { color: #0d9488; }\n" +
            "    .content { padding: 32px; color: #0f172a; line-height: 1.6; font-size: 15px; }\n" +
            "    .content h2 { margin-top: 0; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }\n" +
            "    .otp-code { display: inline-block; font-family: monospace; font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #0d9488; background-color: #f4f4f5; padding: 12px 24px; border-radius: 8px; margin: 20px 0; border: 1px solid #e4e4e7; }\n" +
            "    .cta-button { display: inline-block; background-color: #0f172a; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 14px; }\n" +
            "    .detail-table { width: 100%; border-collapse: collapse; margin: 20px 0; }\n" +
            "    .detail-table th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; padding-bottom: 4px; }\n" +
            "    .detail-table td { font-size: 15px; font-weight: 600; color: #0f172a; padding-bottom: 16px; }\n" +
            "    .note { font-size: 13px; color: #4b5563; margin-top: 24px; border-top: 1px solid #e4e4e7; padding-top: 16px; }\n" +
            "    .footer { padding: 24px 32px; background-color: #f4f4f5; border-top: 1px solid #e4e4e7; text-align: center; font-size: 12px; color: #9ca3af; }\n" +
            "  </style>\n" +
            "</head>\n" +
            "<body>\n" +
            "  <div class=\"wrapper\">\n" +
            "    <div class=\"container\">\n" +
            "      <div class=\"header\">\n" +
            "        <span class=\"logo\"><span class=\"logo-ex\">Ex</span><span class=\"logo-task\">Task</span></span>\n" +
            "      </div>\n" +
            "      <div class=\"content\">\n" +
            "        " + contentHtml + "\n" +
            "      </div>\n" +
            "      <div class=\"footer\">\n" +
            "        <strong>ExTask</strong><br>\n" +
            "        Campus Task Exchange\n" +
            "      </div>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</body>\n" +
            "</html>";

        helper.setText(contentText, htmlTemplate);
        mailsender.send(message);
    }

    // EMAIL 1 — REGISTRATION / WELCOME
    public void sendWelcomeEmail(String to, String name) throws Exception {
        String subject = "Welcome to ExTask — Campus Task Exchange";
        String contentHtml = 
            "<h2>Welcome to ExTask.</h2>" +
            "<p>Hi " + name + ",</p>" +
            "<p>Your account has been created successfully.</p>" +
            "<p>You can now:</p>" +
            "<ul>" +
            "  <li>post tasks</li>" +
            "  <li>browse available work</li>" +
            "  <li>accept tasks</li>" +
            "  <li>submit solutions</li>" +
            "  <li>get paid after approval</li>" +
            "</ul>" +
            "<a href=\"http://localhost:3000\" class=\"cta-button\">Open ExTask</a>" +
            "<p class=\"note\">Keep your account credentials private.</p>";

        String contentText = 
            "Hi " + name + ",\n\n" +
            "Welcome to ExTask.\n" +
            "Your account has been created successfully.\n\n" +
            "You can now:\n" +
            "- post tasks\n" +
            "- browse available work\n" +
            "- accept tasks\n" +
            "- submit solutions\n" +
            "- get paid after approval\n\n" +
            "Open ExTask at http://localhost:3000\n\n" +
            "Keep your account credentials private.\n\n" +
            "ExTask\nCampus Task Exchange";

        sendHtmlEmail(to, subject, contentHtml, contentText);
    }

    // EMAIL 2 — OTP
    public void sendOtpEmail(String to, String name, String otp) throws Exception {
        String subject = "Your ExTask verification code";
        String contentHtml = 
            "<h2>Your verification code</h2>" +
            "<p>Hi " + name + ",</p>" +
            "<p>Use the verification code below to continue resetting your ExTask password.</p>" +
            "<div class=\"otp-code\">" + otp + "</div>" +
            "<p>This code expires in 10 minutes.</p>" +
            "<p class=\"note\">If you did not request this code, you can safely ignore this email.</p>";

        String contentText = 
            "Hi " + name + ",\n\n" +
            "Use the verification code below to continue resetting your ExTask password:\n\n" +
            "[ " + otp + " ]\n\n" +
            "This code expires in 10 minutes.\n\n" +
            "If you did not request this code, you can safely ignore this email.\n\n" +
            "ExTask\nCampus Task Exchange";

        sendHtmlEmail(to, subject, contentHtml, contentText);
    }

    // EMAIL 3 — PAYMENT CONFIRMATION TO POSTER
    public void sendPaymentPosterEmail(String to, String posterName, String taskTitle, int amount, String deliveryType, String paymentId) throws Exception {
        String subject = "Payment completed — " + taskTitle;
        String paymentIdHtml = paymentId != null ? "<tr><th>Payment ID</th></tr><tr><td><code style=\"font-family: monospace; font-size: 14px;\">" + paymentId + "</code></td></tr>" : "";
        String paymentIdText = paymentId != null ? "Payment ID:\n" + paymentId + "\n\n" : "";

        String contentHtml = 
            "<h2>Payment completed successfully</h2>" +
            "<p>Hi " + posterName + ",</p>" +
            "<p>Your payment for the following task has been completed successfully.</p>" +
            "<table class=\"detail-table\">" +
            "  <tr><th>Task</th></tr>" +
            "  <tr><td>" + taskTitle + "</td></tr>" +
            "  <tr><th>Amount Paid</th></tr>" +
            "  <tr><td>₹" + amount + "</td></tr>" +
            "  <tr><th>Delivery</th></tr>" +
            "  <tr><td>" + deliveryType + "</td></tr>" +
            "  <tr><th>Status</th></tr>" +
            "  <tr><td><span style=\"color: #065f46; background-color: #d1fae5; padding: 2px 8px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase;\">PAID</span></td></tr>" +
            paymentIdHtml +
            "</table>" +
            "<p>The submitted work was approved and the payment has been completed through Razorpay.</p>" +
            "<p>Thank you for using ExTask.</p>";

        String contentText = 
            "Hi " + posterName + ",\n\n" +
            "Your payment for the following task has been completed successfully.\n\n" +
            "TASK\n" + taskTitle + "\n\n" +
            "AMOUNT PAID\n₹" + amount + "\n\n" +
            "DELIVERY\n" + deliveryType + "\n\n" +
            "STATUS\nPAID\n\n" +
            "The submitted work was approved and the payment has been completed through Razorpay.\n\n" +
            paymentIdText +
            "Thank you for using ExTask.\n\n" +
            "ExTask\nCampus Task Exchange";

        sendHtmlEmail(to, subject, contentHtml, contentText);
    }

    // EMAIL 4 — PAYMENT CONFIRMATION TO ACCEPTER
    public void sendPaymentAccepterEmail(String to, String accepterName, String taskTitle, int amount, String deliveryType, String paymentId) throws Exception {
        String subject = "Payment received — " + taskTitle;
        String paymentIdHtml = paymentId != null ? "<tr><th>Payment ID</th></tr><tr><td><code style=\"font-family: monospace; font-size: 14px;\">" + paymentId + "</code></td></tr>" : "";
        String paymentIdText = paymentId != null ? "Payment ID:\n" + paymentId + "\n\n" : "";

        String contentHtml = 
            "<h2>Payment received successfully</h2>" +
            "<p>Hi " + accepterName + ",</p>" +
            "<p>Good news — your submission has been approved and payment has been completed.</p>" +
            "<table class=\"detail-table\">" +
            "  <tr><th>Task</th></tr>" +
            "  <tr><td>" + taskTitle + "</td></tr>" +
            "  <tr><th>Amount Received</th></tr>" +
            "  <tr><td>₹" + amount + "</td></tr>" +
            "  <tr><th>Delivery</th></tr>" +
            "  <tr><td>" + deliveryType + "</td></tr>" +
            "  <tr><th>Status</th></tr>" +
            "  <tr><td><span style=\"color: #065f46; background-color: #d1fae5; padding: 2px 8px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase;\">PAID</span></td></tr>" +
            paymentIdHtml +
            "</table>" +
            "<p>Your work was approved by the task poster and the payment has been completed through Razorpay.</p>" +
            "<p>Thank you for completing work through ExTask.</p>";

        String contentText = 
            "Hi " + accepterName + ",\n\n" +
            "Good news — your submission has been approved and payment has been completed.\n\n" +
            "TASK\n" + taskTitle + "\n\n" +
            "AMOUNT RECEIVED\n₹" + amount + "\n\n" +
            "DELIVERY\n" + deliveryType + "\n\n" +
            "STATUS\nPAID\n\n" +
            "Your work was approved by the task poster and the payment has been completed through Razorpay.\n\n" +
            paymentIdText +
            "Thank you for completing work through ExTask.\n\n" +
            "ExTask\nCampus Task Exchange";

        sendHtmlEmail(to, subject, contentHtml, contentText);
    }
}
