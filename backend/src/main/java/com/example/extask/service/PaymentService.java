package com.example.extask.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import com.example.extask.payments.Payment;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

    private static final String KEY="rzp_test_TO5Ai5PZ1oIT57";
    private static final String KEY_SECRET="9b65TduZ5p0EgQGVVy8kfEFo";
    private static final String CURRENCY = "INR";

    public Payment createtransaction(int amount) {
        try {
            JSONObject jsonobj = new JSONObject();
            jsonobj.put("amount", amount * 100); // Razorpay amount in paise
            jsonobj.put("currency", CURRENCY);

            RazorpayClient razorpayclient = new RazorpayClient(KEY, KEY_SECRET);
            Order ord = razorpayclient.orders.create(jsonobj);

            return ordertransction(ord);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Payment ordertransction(Order or) {
        String orderid = or.get("id");
        String currency = or.get("currency");
        int amount = or.get("amount");
        Payment pay = new Payment(orderid, currency, amount, KEY);
        return pay;
    }
}
