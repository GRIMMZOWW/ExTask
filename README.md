# ⚡ ExTask — Campus Coding Marketplace & Task Exchange

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)](https://www.mysql.com/)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6.2-green?logo=springsecurity)](https://spring.io/projects/spring-security)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**ExTask** is a production-grade peer-to-peer campus marketplace where university students post micro-coding tasks, collaborate with fellow campus developers, review code deliverables, and release secure payouts upon approval. The platform features an **escrow-secured financial lifecycle**, holding payments in trust until deliverables (GitHub repositories, pull requests, zip files) are verified.

---

## 🌟 Key Features & Engineering Highlights

### 1. 🛡️ Strict Workflow State Machine
Tasks transition through an immutable state machine protecting both posters and solvers:
- **`OPEN`**: Task is published to the campus marketplace.
- **`ACCEPTED`**: A verified solver claims the task.
- **`SUBMITTED`**: Solver submits their repository URL and deliverables.
- **`CHANGE_REQUESTED`**: Poster requests revisions if deliverables need adjustments.
- **`PAID`**: Poster reviews, approves, and releases the milestone escrow payout.

### 2. ⚡ Global Command Palette (`Ctrl + K`)
- Built-in **Command Palette** accessible from anywhere on the app by pressing `Ctrl + K` or clicking the search bar.
- Implemented with React Portals (`ReactDOM.createPortal`), full keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`), and instant real-time filtering.

### 3. 🎨 Split-Screen Developer Auth & Custom UI
- Responsive **Split-Screen Authentication** featuring live campus network metrics.
- Modern typography, spotlight cursor tracking (`SpotlightCard`), morphological sliding tab bars (`MorphSlider`), and text decoders (`ScrambledText`).

### 4. 🔒 Enterprise Security & Clean Handle Validation
- **Spring Security 6 Architecture**: Session-based security contexts with `SecurityContextHolder` and Role-Based Access Control (`ROLE_ADMIN` vs `ROLE_USER`).
- **Cryptographic Password Protection**: BCrypt salting with automated runtime hash migration fallback.
- **Strict Username Rules**: Enforces professional 3–30 character usernames without spaces (`^[a-zA-Z0-9_]{3,30}$`) across both frontend and backend layers.
- **Temporal OTP Authentication**: 6-digit password recovery codes with 10-minute expiration windows (`LocalDateTime`) and one-time invalidation.

### 5. 📊 Operations & Admin Governance Portal
- Dedicated admin portal (`/admin`) providing revenue analytics, user moderation, transaction logs, and platform health metrics.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 18, React Router v6, Axios, React Icons, React Toastify, CSS3 Animations |
| **Backend REST API** | Java 17/25, Spring Boot 3.2.4, Spring Data JPA / Hibernate, Spring Security 6 |
| **Database** | MySQL 8.0 (InnoDB, Foreign Key Constraints, Performance Indexes) |
| **Security & Auth** | Spring Security Session Context, BCrypt Password Hashing, RBAC |
| **Integrations** | Razorpay Escrow Payments, JavaMailSender SMTP (Gmail Gateway) |

---

## 🔑 Demo Credentials (Ready for Evaluators)

Log into the application at **[http://localhost:3000/login](http://localhost:3000/login)** using any of the verified accounts below:

| Role | Username / Handle | Email | Password | Landing Page |
| :--- | :--- | :--- | :--- | :--- |
| **Platform Admin** | `AdminUser` | `admin@extask.com` | `demo123` | `/admin` (Admin Portal) |
| **Student (Task Poster)** | `AaravPatel` | `aarav.patel@campus.edu` | `demo123` | `/dashboard` / `/browse` |
| **Student (Active Solver)**| `AnanyaVerma` | `ananya.verma@campus.edu` | `demo123` | `/dashboard` / `/browse` |
| **Student** | `RohitMehta` | `rohit.mehta@campus.edu` | `demo123` | `/dashboard` / `/browse` |
| **Student** | `SnehaNair` | `sneha.nair@campus.edu` | `demo123` | `/dashboard` / `/browse` |
| **Student** | `DevSharma` | `dev.sharma@campus.edu` | `demo123` | `/dashboard` / `/browse` |
| **New Student (QA)** | `PriyaKapoor` | `priya.kapoor@campus.edu` | `CampusPass@2026` | `/dashboard` / `/browse` |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **JDK 17+** (Eclipse Adoptium / OpenJDK)
- **Node.js (v18+) & npm**
- **MySQL Server 8.0+**

### 2. Database Initialization
1. Create the MySQL database:
   ```sql
   CREATE DATABASE extask_db;
   ```
2. Verify database connection credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/extask_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_PASSWORD
   ```

### 3. Start the Backend API (Spring Boot)
Navigate to the `backend/` directory:
```bash
cd backend
mvn clean compile spring-boot:run
```
👉 Server starts at: **`http://localhost:8080`**

### 4. Start the Frontend Client (React)
In a separate terminal, navigate to `frontend/`:
```bash
cd frontend
npm install
npm start
```
👉 Application loads at: **`http://localhost:3000`**

---

## 📡 REST API Architecture

### User & Authentication (`/api/users`)
- `POST /api/users/register` — Register new campus student with validation.
- `POST /api/users/login` — Authenticate user and initiate Spring Security session.
- `POST /api/users/logout` — Invalidate session context.
- `POST /api/users/forgot-password` — Generate and email 6-digit OTP.
- `POST /api/users/verify-otp` — Validate time-bounded OTP code.
- `POST /api/users/reset-password` — Update password with verification.
- `PUT /api/users/update/{id}` — Update user name and email.
- `GET /api/users/getall` — Retrieve user roster (Admin only).

### Task Marketplace (`/api/tasks`)
- `GET /api/tasks/getall` — List all tasks with optional status filter (`?status=OPEN`).
- `GET /api/tasks/{id}` — Fetch detailed task timeline and deliverables.
- `GET /api/tasks/by-user/{userId}` — Fetch tasks posted by specific user.
- `GET /api/tasks/accepted-by/{userId}` — Fetch tasks accepted by specific solver.
- `POST /api/tasks/add` — Create and publish a new task.
- `PUT /api/tasks/accept/{id}` — Commit to solving an open task.
- `PUT /api/tasks/submit/{id}` — Deliver solution URL / code deliverables.
- `PUT /api/tasks/request-changes/{id}` — Request revisions on submitted work.
- `PUT /api/tasks/approve/{id}` — Approve submission and mark task for payment.

### Payments & Escrow (`/api/payments`)
- `POST /api/payments/create-order` — Initialize Razorpay escrow transaction.
- `POST /api/payments/verify` — Verify cryptographic payment signature.
- `GET /api/payments/getall` — Audit log of all completed transactions (Admin only).

---

## 📁 Repository Structure

```
ExTask/
├── backend/                             # Java Spring Boot Backend
│   ├── src/main/java/com/example/extask/
│   │   ├── config/                      # SecurityConfig, WebConfig
│   │   ├── payments/                    # Payment Entity, Controller, Service
│   │   ├── service/                     # EmailService (SMTP)
│   │   ├── tasks/                       # Task Entity, Controller, Service
│   │   └── users/                       # User Entity, Controller, UserService
│   └── src/main/resources/              # application.properties
│
├── frontend/                            # React.js Frontend
│   ├── src/
│   │   ├── api/                         # Axios instance & interceptors
│   │   ├── components/                  # Navbar, CommandPalette, AuthShowcase, Modals
│   │   ├── pages/                       # Landing, Browse, Dashboard, TaskDetail, Admin
│   │   ├── index.css                    # Design system & animations
│   │   └── App.js                       # Route definitions & global listeners
│   └── package.json
│
└── README.md                            # Documentation & Demo Guide
```

---

## 📄 License
This project is licensed under the **MIT License** — feel free to use and extend for campus software development.
