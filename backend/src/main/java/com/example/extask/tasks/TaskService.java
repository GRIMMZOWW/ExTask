package com.example.extask.tasks;

import com.example.extask.users.User;
import com.example.extask.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // Create/Post a task
    public Task postTask(Task task) {
        // Validate poster exists
        Optional<User> poster = userRepository.findById(task.getPostedBy());
        if (poster.isEmpty()) {
            return null;
        }
        task.setStatus("OPEN");
        task.setAcceptedBy(null);
        task.setDeliveryContent(null);
        return taskRepository.save(task);
    }

    // Get all tasks, optionally filter by status
    public List<Task> getAllTasks(String status) {
        if (status != null && !status.trim().isEmpty()) {
            return taskRepository.findByStatus(status);
        }
        return taskRepository.findAll();
    }

    // Get task by ID
    public Task getTaskById(int id) {
        return taskRepository.findById(id).orElse(null);
    }

    // Accept a task
    public String acceptTask(int taskId, int userId) {
        Optional<Task> optTask = taskRepository.findById(taskId);
        if (optTask.isEmpty()) {
            return "Task not found";
        }
        Task task = optTask.get();

        if (!"OPEN".equals(task.getStatus())) {
            return "Task is not open for acceptance";
        }

        if (task.getPostedBy() == userId) {
            return "You cannot accept your own task";
        }

        Optional<User> optUser = userRepository.findById(userId);
        if (optUser.isEmpty()) {
            return "User not found";
        }

        // Admins are marketplace observers/managers, not solvers
        if ("ADMIN".equalsIgnoreCase(optUser.get().getRole())) {
            return "Admins cannot accept tasks as solvers";
        }

        task.setAcceptedBy(userId);
        task.setStatus("ACCEPTED");
        taskRepository.save(task);
        return "SUCCESS";
    }

    // Submit task delivery (allowed from ACCEPTED or CHANGE_REQUESTED status)
    public String submitTask(int taskId, int userId, String deliveryContent) {
        Optional<Task> optTask = taskRepository.findById(taskId);
        if (optTask.isEmpty()) {
            return "Task not found";
        }
        Task task = optTask.get();

        if (!"ACCEPTED".equals(task.getStatus()) && !"CHANGE_REQUESTED".equals(task.getStatus())) {
            return "Task cannot be submitted in its current status";
        }

        Optional<User> optUser = userRepository.findById(userId);
        if (optUser.isEmpty()) {
            return "User not found";
        }

        if ("ADMIN".equalsIgnoreCase(optUser.get().getRole())) {
            return "Admins cannot submit deliverables";
        }

        if (task.getAcceptedBy() == null || task.getAcceptedBy() != userId) {
            return "You are not the accepter of this task";
        }

        if (deliveryContent == null || deliveryContent.trim().isEmpty()) {
            return "Delivery content cannot be empty";
        }

        task.setDeliveryContent(deliveryContent.trim());
        task.setStatus("SUBMITTED");
        taskRepository.save(task);
        return "SUCCESS";
    }

    // Edit task (only by owner when OPEN and not accepted)
    public String editTask(int taskId, int userId, Task updatedFields) {
        Optional<Task> optTask = taskRepository.findById(taskId);
        if (optTask.isEmpty()) {
            return "Task not found";
        }
        Task task = optTask.get();

        if (task.getPostedBy() != userId) {
            return "Only the task owner can edit this task";
        }

        if (!"OPEN".equals(task.getStatus()) || task.getAcceptedBy() != null) {
            return "Only OPEN unaccepted tasks can be edited";
        }

        if (updatedFields.getTitle() == null || updatedFields.getTitle().trim().isEmpty()) {
            return "Title cannot be empty";
        }

        if (updatedFields.getBudget() <= 0) {
            return "Budget must be a positive number";
        }

        if (updatedFields.getDeliveryType() == null || updatedFields.getDeliveryType().trim().isEmpty()) {
            return "Delivery format is required";
        }

        task.setTitle(updatedFields.getTitle().trim());
        task.setDescription(updatedFields.getDescription());
        task.setBudget(updatedFields.getBudget());
        task.setDeliveryType(updatedFields.getDeliveryType().trim());

        taskRepository.save(task);
        return "SUCCESS";
    }

    // Request changes / revisions (only by owner when SUBMITTED)
    public String requestChanges(int taskId, int userId, String feedback) {
        Optional<Task> optTask = taskRepository.findById(taskId);
        if (optTask.isEmpty()) {
            return "Task not found";
        }
        Task task = optTask.get();

        if (task.getPostedBy() != userId) {
            return "Only the task owner can request changes";
        }

        if (!"SUBMITTED".equals(task.getStatus())) {
            return "Changes can only be requested after work has been SUBMITTED";
        }

        if (feedback == null || feedback.trim().isEmpty()) {
            return "Please provide feedback describing the changes needed";
        }

        task.setStatus("CHANGE_REQUESTED");
        task.setRevisionFeedback(feedback.trim());
        taskRepository.save(task);
        return "SUCCESS";
    }

    // Delete task (only if OPEN and by poster, or by admin)
    public String deleteTask(int taskId, int userId) {
        Optional<Task> optTask = taskRepository.findById(taskId);
        if (optTask.isEmpty()) {
            return "Task not found";
        }
        Task task = optTask.get();

        Optional<User> optUser = userRepository.findById(userId);
        if (optUser.isEmpty()) {
            return "User not found";
        }
        User user = optUser.get();

        boolean isAdmin = "ADMIN".equals(user.getRole());
        boolean isPoster = task.getPostedBy() == userId;

        if (!isAdmin && !isPoster) {
            return "Access denied";
        }

        if (!isAdmin && !"OPEN".equals(task.getStatus())) {
            return "Only OPEN tasks can be deleted by the poster";
        }

        taskRepository.delete(task);
        return "SUCCESS";
    }

    // Tasks posted by user
    public List<Task> getTasksPostedByUser(int userId) {
        return taskRepository.findByPostedBy(userId);
    }

    // Tasks accepted by user
    public List<Task> getTasksAcceptedByUser(int userId) {
        return taskRepository.findByAcceptedBy(userId);
    }
}
