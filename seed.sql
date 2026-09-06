-- Reset existing tables
DELETE FROM extask_db.payments;
DELETE FROM extask_db.tasks;
DELETE FROM extask_db.users;

-- Insert Users
INSERT INTO extask_db.users (id, name, email, password, role, created_at) VALUES
(1, 'Admin Moderator', 'admin@extask.com', 'demo123', 'ADMIN', NOW()),
(2, 'Alice Green', 'alice@extask.com', 'demo123', 'USER', NOW()),
(3, 'Bob Miller', 'bob@extask.com', 'demo123', 'USER', NOW()),
(4, 'Charlie Brown', 'charlie@extask.com', 'demo123', 'USER', NOW()),
(5, 'Diana Prince', 'diana@extask.com', 'demo123', 'USER', NOW());

-- Insert Tasks
INSERT INTO extask_db.tasks (id, posted_by, title, description, budget, delivery_type, accepted_by, delivery_content, status, created_at) VALUES
-- OPEN tasks
(1, 2, 'Build Responsive Landing Page', 'We need a simple, single-page responsive landing page for our university sports club. Tech stack: React + Tailwind CSS. Design assets will be provided.', 1500, 'GitHub Link', NULL, NULL, 'OPEN', NOW()),
(2, 2, 'Fix React state bug in Cart', 'Whenever a user adds a product multiple times, the cart count does not update correctly. Need a developer to check local storage and Context API logic.', 400, 'Direct Code', NULL, NULL, 'OPEN', NOW()),
(3, 4, 'Create Spring Boot REST endpoints', 'Implement basic CRUD endpoints for an Inventory management feature with JPA and MySQL. No complex security patterns needed.', 2500, 'Zip File', NULL, NULL, 'OPEN', NOW()),
(4, 5, 'Python script to scrape menu', 'Write a clean Python script using BeautifulSoup or Selenium to scrape the campus cafeteria menu daily and output a JSON format.', 600, 'GitHub Link', NULL, NULL, 'OPEN', NOW()),

-- ACCEPTED tasks
(5, 4, 'Design PostgreSQL Database Schema', 'Design database schema for a campus event booking app. Provide table creation scripts and ER diagram.', 1200, 'GitHub Link', 3, NULL, 'ACCEPTED', NOW()),
(6, 2, 'Integrate OpenWeather API in React', 'Fetch current weather and 5-day forecast based on campus ZIP code. Show loading spinners and basic error handling.', 800, 'Zip File', 5, NULL, 'ACCEPTED', NOW()),

-- SUBMITTED tasks
(7, 5, 'Java Swing Calculator App', 'Simple desktop calculator supporting addition, subtraction, multiplication, division, and basic memory functions.', 1000, 'Zip File', 3, 'https://github.com/bob-miller/swing-calculator/archive/refs/heads/main.zip', 'SUBMITTED', NOW()),
(8, 4, 'Tailwind Form validation check', 'Add client side validation checks to registration form pages (check email format, password matching, required fields).', 500, 'Direct Code', 2, 'function validateForm() { console.log("Validated!"); }', 'SUBMITTED', NOW()),

-- PAID tasks
(9, 2, 'Django API for simple todo app', 'Build a backend API using Django REST Framework for a Todo application. Must support GET/POST/PUT/DELETE.', 1800, 'GitHub Link', 3, 'https://github.com/bob-miller/django-todo-api', 'PAID', NOW()),
(10, 4, 'Fix Flexbox layout on navigation', 'The navigation bar elements overlap on small screen resolutions. Need to adjust Flexbox parameters.', 300, 'Direct Code', 5, 'flex-wrap: wrap; justify-content: space-between;', 'PAID', NOW());

-- Insert Payments
INSERT INTO extask_db.payments (id, task_id, amount, razorpay_order_id, razorpay_payment_id, status, paid_at) VALUES
(1, 9, 1800, 'order_mock_1234567890', 'pay_mock_1234567890', 'PAID', NOW()),
(2, 10, 300, 'order_mock_0987654321', 'pay_mock_0987654321', 'PAID', NOW());
