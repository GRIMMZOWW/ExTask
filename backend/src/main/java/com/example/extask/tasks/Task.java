package com.example.extask.tasks;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "posted_by", nullable = false)
    private int postedBy;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int budget;

    @Column(name = "delivery_type", nullable = false, length = 20)
    private String deliveryType;

    @Column(name = "accepted_by")
    private Integer acceptedBy;

    @Column(name = "delivery_content", columnDefinition = "TEXT")
    private String deliveryContent;

    @Column(name = "revision_feedback", columnDefinition = "TEXT")
    private String revisionFeedback;

    @Column(nullable = false, length = 20)
    private String status = "OPEN";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Task() {}

    // All getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getPostedBy() { return postedBy; }
    public void setPostedBy(int postedBy) { this.postedBy = postedBy; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getBudget() { return budget; }
    public void setBudget(int budget) { this.budget = budget; }
    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }
    public Integer getAcceptedBy() { return acceptedBy; }
    public void setAcceptedBy(Integer acceptedBy) { this.acceptedBy = acceptedBy; }
    public String getDeliveryContent() { return deliveryContent; }
    public void setDeliveryContent(String deliveryContent) { this.deliveryContent = deliveryContent; }
    public String getRevisionFeedback() { return revisionFeedback; }
    public void setRevisionFeedback(String revisionFeedback) { this.revisionFeedback = revisionFeedback; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
