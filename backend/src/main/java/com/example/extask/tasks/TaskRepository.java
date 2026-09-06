package com.example.extask.tasks;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByStatus(String status);
    List<Task> findByPostedBy(int postedBy);
    List<Task> findByAcceptedBy(int acceptedBy);
}
