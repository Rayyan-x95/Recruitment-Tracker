# 💼 Recruitment Tracker (RecTracker)

A full-stack, enterprise-grade **Recruitment & Candidate Pipeline Management Platform**. Designed to streamline talent acquisition, interview scheduling, candidate evaluations, and job offer workflows.

Built with a **Java 21 / Spring Boot 3** REST backend and a modern **React 19 / Vite 8** single-page application.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start & Running Locally](#-quick-start--running-locally)
- [Environment Configuration](#-environment-configuration)
- [Database Configuration & H2 Console](#-database-configuration--h2-console)
- [REST API Endpoints](#-rest-api-endpoints)
- [Build & Code Quality Commands](#-build--code-quality-commands)
- [License](#-license)

---

## ✨ Features

- 📊 **Interactive Analytics Dashboard**: Real-time pipeline metrics, candidate breakdown charts, interview schedules, and offer acceptance rate analytics.
- 👥 **Candidate Pipeline Management**: Full CRUD operations for candidate profiles, experience tracking, skill tags, pipeline status (`APPLIED`, `SCREENING`, `INTERVIEWING`, `OFFERED`, `HIRED`, `REJECTED`), and resume file attachments.
- 📅 **Interview Scheduling**: Organize interview rounds (`HR`, `TECHNICAL_ROUND_1`, `TECHNICAL_ROUND_2`, `SYSTEM_DESIGN`, `MANAGERIAL`), assign interviewers, set dates, and manage round statuses.
- 📝 **Structured Evaluation & Feedback**: Score candidates across Technical, Communication, and Problem-Solving capabilities with star ratings and recommendations (`HIRE`, `NO_HIRE`, `STRONG_HIRE`, `HOLD`).
- 💼 **Job Offer Management**: Track compensation packages, offered CTC, joining dates, and offer lifecycle statuses (`PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`).
- 🔒 **Hybrid Authentication**: Support for both Supabase Auth and local Spring Boot security authentication.
- 🎨 **Minimal & Modern UI**: Designed with glassmorphism header navigation, responsive Bootstrap 5 layout, custom dark/light aesthetic tokens, and live status badges.

---

## 🛠️ Architecture & Tech Stack

### Backend
- **Language & JDK**: Java 21
- **Framework**: Spring Boot 3.3.x (Spring Web, Spring Security, Spring Data JPA)
- **Database**: H2 (In-Memory with MySQL compatibility mode for zero-setup execution) / MySQL 8.x / Supabase Postgres
- **Build Tool**: Apache Maven Wrapper (`mvnw`)

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Vanilla CSS with custom tokens, Bootstrap 5.3, FontAwesome 7
- **Data Visualization**: Chart.js (`react-chartjs-2`)
- **HTTP Client**: Axios with configured interceptors
- **Authentication**: Supabase JS SDK + Local Auth Fallback

---

## 📁 Project Directory Structure

```text
Rec Tracker/
├── frontend/                       # React 19 + Vite 8 SPA
│   ├── src/
│   │   ├── api/                    # Axios API configuration
│   │   ├── components/             # Minimal Navbar, Footer & ProtectedRoute components
│   │   ├── context/                # AuthContext (Supabase & Spring Auth handlers)
│   │   ├── pages/                  # Dashboard, Candidates, Interviews, Feedbacks, Offers, Auth
│   │   └── utils/                  # Supabase clients & middleware
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── src/                            # Java Spring Boot 3 Backend
│   └── main/
│       ├── java/com/rectracker/
│       │   ├── config/             # CORS, PasswordEncoder, WebMvc configurations
│       │   ├── controller/         # REST Controllers & Thymeleaf MVC Controllers
│       │   ├── dao/                # Data Access Objects (Candidate, Interview, User, etc.)
│       │   ├── exception/          # Global Exception Handler & Validation Handling
│       │   ├── model/              # Domain Entities (Candidate, User, Interview, Offer, Feedback)
│       │   ├── service/            # Business Logic Services & Implementations
│       │   └── utility/            # DB Connection, File Storage, Password, Validation utilities
│       └── resources/
│           ├── application.properties
│           ├── schema.sql / data.sql
│           └── templates/          # Thymeleaf views & components
├── scripts/                        # Database seed and push utilities
├── uploads/                        # Uploaded resume & document storage
├── .env.example                    # Backend environment configuration template
├── .gitignore                      # Git ignore rule definitions
├── pom.xml                         # Maven project object model
├── supabase_schema.sql             # SQL Schema for Supabase Postgres deployment
└── README.md                       # Comprehensive documentation
```

---

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed on your machine:

- **Java JDK**: Version 21 or higher
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: Installed and configured

---

## 🚀 Quick Start & Running Locally

### 1. Clone the Repository
```powershell
git clone <YOUR_REPOSITORY_URL>
cd "Rec Tracker"
```

### 2. Start the Spring Boot Backend Server
From the root directory, execute the Maven wrapper command:
```powershell
.\mvnw.cmd spring-boot:run
```
*The Spring Boot server will compile and start at **`http://localhost:8080`**.*

### 3. Start the React Frontend Application
Open a new terminal window, navigate to the `frontend` folder, install dependencies, and launch the dev server:
```powershell
cd frontend
npm install
npm run dev
```
*The Vite frontend server will start at **`http://localhost:5173`**.*

---

## 🔐 Environment Configuration

Create `.env.local` files based on the included `.env.example` files:

### Root Backend Environment (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### Frontend Environment (`frontend/.env.local`)
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

---

## 🗄️ Database Configuration & H2 Console

By default, the application runs using an embedded in-memory **H2 Database** configured with MySQL compatibility mode, requiring zero local database setup.

### Accessing H2 Web Console
- **Console URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:rectrackerdb`
- **Username**: `sa`
- **Password**: *(Leave blank)*

### MySQL Production Switch
To switch to a production MySQL instance, update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rectracker_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

---

## 📡 REST API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/auth/login` | Authenticate user & get session |
| | `POST` | `/api/auth/register` | Register new recruiter/admin account |
| | `GET` | `/api/auth/me` | Fetch authenticated user profile |
| **Candidates** | `GET` | `/api/candidates` | Fetch candidates (with search, status, & exp filters) |
| | `POST` | `/api/candidates` | Create new candidate profile |
| | `GET` | `/api/candidates/{id}` | Fetch candidate detail by ID |
| | `PUT` | `/api/candidates/{id}` | Update candidate details |
| | `DELETE` | `/api/candidates/{id}` | Delete candidate profile |
| **Interviews** | `GET` | `/api/interviews` | Fetch all scheduled interviews |
| | `POST` | `/api/interviews` | Schedule new interview round |
| | `PUT` | `/api/interviews/{id}`| Update interview round details |
| | `DELETE` | `/api/interviews/{id}`| Cancel/Delete interview schedule |
| **Feedback** | `GET` | `/api/feedbacks` | Fetch interview evaluations |
| | `POST` | `/api/feedbacks` | Submit interview feedback & rating |
| **Offers** | `GET` | `/api/offers` | List candidate job offers |
| | `POST` | `/api/offers` | Generate job offer record |
| | `PATCH` | `/api/offers/{id}/status` | Update offer status (`ACCEPTED`, `REJECTED`, `EXPIRED`) |
| | `DELETE` | `/api/offers/{id}` | Delete job offer record |
| **Analytics** | `GET` | `/api/analytics/summary` | Fetch pipeline metrics and dashboard counts |

---

## 🛠️ Build & Code Quality Commands

### Backend Build & Test
```powershell
# Compile Java backend
.\mvnw.cmd compile

# Clean build and compile tests
.\mvnw.cmd clean test-compile
```

### Frontend Build & Lint
```powershell
cd frontend

# Run Oxlint code analysis
npm run lint

# Build production distribution bundle
npm run build
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
