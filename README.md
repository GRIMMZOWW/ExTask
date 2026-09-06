# ExTask — Campus Task Exchange

ExTask is a campus exchange platform where students can exchange tasks (such as documentation, practical work, creative assignments, design, coding, or technical tasks) with other students.

---

## 🛠️ Prerequisites

Before running the application, make sure you have the following installed:
- **Java SE Development Kit (JDK) 17**
- **Apache Maven 3.8+**
- **MySQL Server 8.0+**
- **Node.js (v18+) & npm**

---

## 💾 Database Setup

1. Open your MySQL client and create a database named `extask_db`:
   ```sql
   CREATE DATABASE extask_db;
   ```
2. Import the database schema and sample data using the provided `seed.sql` script located in the project root:
   ```bash
   mysql -u root -p extask_db < seed.sql
   ```
3. Update your database credentials (username and password) if necessary inside:
   `backend/src/main/resources/application.properties`

---

## 🚀 Local Development Startup

To run the complete application locally, follow these two steps:

### Step 1: Start the Backend REST API
Navigate to the `backend/` directory and execute the spring-boot run command:
```bash
cd backend
mvn spring-boot:run
```
The backend server compiles the classes and boots the Tomcat web application on:
👉 **http://localhost:8080**

### Step 2: Start the Frontend React Client
Navigate to the `frontend/` directory, install packages, and boot the client:
```bash
cd frontend
npm install
npm run dev
```
The frontend compiler starts the local server on:
👉 **http://localhost:3000**

---

## 🧭 How React Connects to Spring Boot

1. **CORS Mapping**: The backend allows cross-origin requests from the React client through [`WebConfig.java`](backend/src/main/java/com/example/extask/config/WebConfig.java), mapping all incoming `/api/**` paths to allow origin `http://localhost:3000`.
2. **API Clients Base URL**: The React frontend client communicates via Axios inside [`axios.js`](frontend/src/api/axios.js), utilizing the `REACT_APP_API_BASE_URL` environment variable:
   * During local dev, this defaults to: `http://localhost:8080/api`.
   * You can customize this by copying `frontend/.env.example` to `frontend/.env` and modifying its values.

---

## 🚀 Live Demo Credentials
Log into the application using the password **`demo123`**:
* **Admin Moderator**: `admin@extask.com`
* **Alice (Poster)**: `alice@extask.com`
* **Bob (Solver/Accepter)**: `bob@extask.com`
* **Charlie**: `charlie@extask.com`
* **Diana**: `diana@extask.com`
* **Test Poster Accepter**: `labjournal9@gmail.com`
