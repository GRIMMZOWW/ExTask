package com.example.extask.tasks;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // GET /api/tasks/getall?status=
    @GetMapping("/getall")
    public ResponseEntity<List<Task>> getAllTasks(@RequestParam(value = "status", required = false) String status) {
        List<Task> tasks = taskService.getAllTasks(status);
        return ResponseEntity.ok(tasks);
    }

    // GET /api/tasks/get/{id}
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable("id") int id) {
        Task task = taskService.getTaskById(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task);
    }

    // POST /api/tasks/add
    @PostMapping("/add")
    public ResponseEntity<?> addTask(@RequestBody Task task) {
        Task saved = taskService.postTask(task);
        if (saved == null) {
            return ResponseEntity.badRequest().body("Failed to post task. Poster not found.");
        }
        return ResponseEntity.ok(saved);
    }

    // POST /api/tasks/accept/{id}
    @PostMapping("/accept/{id}")
    public ResponseEntity<?> acceptTask(@PathVariable("id") int id, @RequestBody Map<String, Object> body) {
        if (body.get("userId") == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }
        int userId = Integer.parseInt(body.get("userId").toString());
        String res = taskService.acceptTask(id, userId);
        if (!"SUCCESS".equals(res)) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok("Task accepted successfully");
    }

    // POST /api/tasks/submit/{id}
    @PostMapping("/submit/{id}")
    public ResponseEntity<?> submitTask(@PathVariable("id") int id, @RequestBody Map<String, Object> body) {
        if (body.get("userId") == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }
        int userId = Integer.parseInt(body.get("userId").toString());
        String deliveryContent = (String) body.get("deliveryContent");
        String res = taskService.submitTask(id, userId, deliveryContent);
        if (!"SUCCESS".equals(res)) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok("Task delivery submitted successfully");
    }

    // PUT or POST /api/tasks/edit/{id}
    @RequestMapping(value = "/edit/{id}", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<?> editTask(@PathVariable("id") int id, @RequestBody Map<String, Object> body) {
        if (body.get("userId") == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }
        int userId = Integer.parseInt(body.get("userId").toString());

        Task updatedFields = new Task();
        updatedFields.setTitle((String) body.get("title"));
        updatedFields.setDescription((String) body.get("description"));
        if (body.get("budget") != null) {
            updatedFields.setBudget(Integer.parseInt(body.get("budget").toString()));
        }
        updatedFields.setDeliveryType((String) body.get("deliveryType"));

        String res = taskService.editTask(id, userId, updatedFields);
        if (!"SUCCESS".equals(res)) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok("Task updated successfully");
    }

    // POST /api/tasks/request-changes/{id}
    @PostMapping("/request-changes/{id}")
    public ResponseEntity<?> requestChanges(@PathVariable("id") int id, @RequestBody Map<String, Object> body) {
        if (body.get("userId") == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }
        int userId = Integer.parseInt(body.get("userId").toString());
        String feedback = (String) body.get("feedback");
        String res = taskService.requestChanges(id, userId, feedback);
        if (!"SUCCESS".equals(res)) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok("Change request submitted successfully");
    }

    // DELETE /api/tasks/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable("id") int id, @RequestParam("userId") int userId) {
        String res = taskService.deleteTask(id, userId);
        if (!"SUCCESS".equals(res)) {
            return ResponseEntity.badRequest().body(res);
        }
        return ResponseEntity.ok("Task deleted successfully");
    }

    // GET /api/tasks/by-user/{userId}
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Task>> getTasksPostedByUser(@PathVariable("userId") int userId) {
        List<Task> tasks = taskService.getTasksPostedByUser(userId);
        return ResponseEntity.ok(tasks);
    }

    // GET /api/tasks/accepted-by/{userId}
    @GetMapping("/accepted-by/{userId}")
    public ResponseEntity<List<Task>> getTasksAcceptedByUser(@PathVariable("userId") int userId) {
        List<Task> tasks = taskService.getTasksAcceptedByUser(userId);
        return ResponseEntity.ok(tasks);
    }
}
