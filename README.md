# 🌌 Quiziverse — Production-Ready AI-Powered Quiz Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%283NF%29-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20%2F%20OpenAI-8e75ff?logo=google&logoColor=white)](https://ai.google.dev/)
[![Security](https://img.shields.io/badge/Security-Helmet%20%2B%20JWT%20%2B%20RateLimit-emerald)](https://expressjs.com/)

**Quiziverse** is an enterprise-grade, full-stack educational assessment and gamification web application engineered to support **100+ simultaneous participants**. Built with a focus on anti-cheat integrity, zero-leak AI question synthesis, sub-millisecond leaderboard queries, and dynamic level progression.

---

## 🌟 Key Subsystems & Features

### 1. 🛡️ Anti-Cheat Question Engine & Server-Side Scoring
- **Zero-Leak Client Delivery**: During active quizzes, `correct_answer_index` and `explanation` fields are strictly stripped from responses.
- **Server-Side Evaluation**: Answers are computed and scored atomically on the backend, preventing client devtools manipulation.
- **Conceptual Explanations**: Deep conceptual rationales and topic mastery analytics are unlocked post-submission.

### 2. 🤖 Provider-Agnostic Modular AI Engine
- **Factory Architecture**: Seamlessly switch between **Google Gemini 1.5 Flash**, **OpenAI GPT-4o-mini**, or a zero-cost deterministic synthesizer.
- **Single-Answer Validation**: Enforces exactly 4 choices per question, a single verified answer index ($0 - 3$), and non-empty rationale.
- **Zero Frontend Key Exposure**: LLM API keys live exclusively in `backend/.env`.

### 3. 🎮 Gamification Engine (XP, Levels, Streaks & Badges)
- **Daily Quiz Streaks**: Calendar-day difference comparison (`same-day` $\rightarrow$ preserve, `consecutive-day` $\rightarrow +1$, `missed` $\rightarrow$ reset to 1) with all-time personal best tracking.
- **Dynamic Level Progression**: Smooth $1{,}000\text{ XP}$ tiered curve with progressive rank titles (*Apprentice* $\rightarrow$ *Scholar* $\rightarrow$ *Master* $\rightarrow$ *Grandmaster*).
- **10 Milestone Badges**: Idempotent trigger rules (`FIRST_QUIZ`, `QUIZ_FIVE`, `QUIZ_TEN`, `PERFECT_SCORE`, `HIGH_SCORE_90`, `STREAK_3`, `STREAK_7`, `SPEED_DEMON`, `AI_PIONEER`, `LEVEL_5`).

### 4. 🏆 Real-Time Leaderboards (Global, Weekly, Monthly)
- **Window Functions**: Uses PostgreSQL `DENSE_RANK() OVER (...)` with composite B-Tree indexes (`points DESC, xp DESC` and `completed_at DESC, points_earned DESC`).
- **Rolling Timeframes**: 7-day weekly and 30-day monthly timeframes update automatically without cron maintenance.
- **Student Rank Pinning**: Resolves and pins the logged-in student's exact standing outside the top 3.

### 5. 👑 Faculty & Admin Control Portal
- **User Role Management**: List registered students and faculty with search; promote to admin or demote with **self-demotion lockout protection**.
- **Quiz Moderation**: Publish/unpublish toggle, question inspector modals, and cascading quiz deletion.
- **Platform Analytics & Audits**: Real-time pass rate metrics, popular quizzes, and complete student attempt audit logs.

### 6. 🔒 Security & Performance Hardening
- **Strict Input Validation**: Centralized schema enforcement on registration, login, quiz authoring, and AI generation.
- **XSS Sanitization**: Automatically strips `<script>` tags, DOM event handlers, and javascript protocols.
- **Quota & DoS Protection**: 1MB JSON body payload limit and dedicated rate limiters (API: 300 req/15m, Auth: 25 req/15m, AI: 10 req/15m).
- **100% Parameterized SQL**: Zero string concatenation in database queries.

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    Client[React 18 SPA - Vite] -->|HTTPS / Bearer JWT| ReverseProxy[Reverse Proxy / Express REST API]
    
    subgraph SecurityLayer ["Security & Middleware Layer"]
        ReverseProxy --> Helmet[Helmet: CSP & Frameguard]
        Helmet --> RateLimiter[express-rate-limit: Tiered Limiting]
        RateLimiter --> Validator[Input Validation & XSS Sanitizer]
        Validator --> AuthGuard[JWT Verify & RBAC Guard]
    end

    subgraph ServiceSubsystems ["Backend Service Layer"]
        AuthGuard --> AuthCtrl[auth.controller.js]
        AuthGuard --> QuizCtrl[quiz.controller.js (Anti-Cheat)]
        AuthGuard --> AttemptCtrl[attempt.controller.js (Atomic Txn)]
        AuthGuard --> Gamification[gamification.service.js]
        AuthGuard --> LeaderboardCtrl[leaderboard.controller.js (DENSE_RANK)]
        AuthGuard --> AdminCtrl[admin.controller.js]
        AuthGuard --> AIFactory[services/ai/index.js]
    end

    subgraph ExternalAI ["AI Provider Layer"]
        AIFactory --> Gemini[Google Gemini 1.5 Flash]
        AIFactory --> OpenAI[OpenAI GPT-4o-mini]
        AIFactory --> FallbackAI[Offline Deterministic Synthesizer]
    end

    subgraph DatabaseLayer ["PostgreSQL Relational Schema (3NF)"]
        AttemptCtrl --> DB[(PostgreSQL Pool: 100+ Concurrency)]
        LeaderboardCtrl --> DB
        AdminCtrl --> DB
        QuizCtrl --> DB
    end
```

---

## 📁 Repository Structure

```text
Quiziverse.web/
├── frontend/                     # React 18 SPA (Vite + React Router)
│   ├── src/
│   │   ├── components/           # UI Components (Navbar, Footer, Modals, StatCards)
│   │   ├── context/              # State Providers (AuthContext, QuizContext)
│   │   ├── data/                 # Seed & mock fallback datasets
│   │   ├── pages/                # Application Views (Home, Quiz, Dashboard, Admin, etc.)
│   │   ├── services/             # Centralized Axios/Fetch API client
│   │   ├── App.jsx               # Route mapping & ProtectedRoute guards
│   │   └── index.css             # Cosmic Dark design system & CSS variables
│   ├── package.json
│   └── vite.config.js
├── backend/                      # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/               # DB pool & environment configuration
│   │   ├── controllers/          # Business logic handlers
│   │   ├── middleware/           # Auth, RBAC, Validator, RateLimiters, ErrorHandler
│   │   ├── routes/               # Modular Express routers
│   │   ├── scripts/              # Migration & connectivity test runners
│   │   ├── services/             # Gamification service & AI adapter layer
│   │   │   └── ai/               # Gemini, OpenAI, and Mock AI providers
│   │   └── utils/                # JWT signers, bcrypt, API response wrappers
│   ├── package.json
│   └── server.js
├── database/                     # Normalized PostgreSQL Schema & Seeds
│   ├── schema.sql                # 8 tables, foreign keys, checks, B-Tree indexes
│   └── seed.sql                  # Initial users, quizzes, questions, achievements
├── .gitignore                    # Production gitignore (excludes .env, node_modules)
└── README.md                     # Platform documentation
```

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js** (v18 or v20 LTS recommended): `node -v`
- **npm**: `npm -v`
- **PostgreSQL** (v14+ recommended) or cloud database (Supabase / Neon / Railway)

### 2. Configure Environment Variables
Copy the templates and adjust your credentials:
```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

### 3. Initialize the Database
Run the automated schema and seed migration runner:
```bash
cd backend
npm run db:init
```

### 4. Start the Backend Server
```bash
cd backend
npm run dev
```
*(Server active on `http://localhost:5000` with health probe at `/api/health`)*

### 5. Start the Frontend Application
In a separate terminal window:
```bash
cd frontend
npm run dev
```
*(Frontend active on `http://localhost:5173`)*

---

## 🔑 Demo Accounts & Credentials

| Role | Email | Password | Pre-seeded Features |
| :--- | :--- | :--- | :--- |
| **Student** | `student@quiziverse.io` | `password123` | Level 5 Master Scholar, 4-day streak, 12 attempts, 4 achievements |
| **Faculty Admin** | `admin@quiziverse.io` | `password123` | Full administrative control, user role management, quiz moderation |

---

## 📡 REST API Reference Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime, memory, and database connection probe |
| `POST` | `/api/auth/register` | Public | Register new student with password complexity check |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue signed JWT Bearer token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile & stats |
| `GET` | `/api/quizzes` | Public | List published quizzes with search & difficulty filters |
| `GET` | `/api/quizzes/:id` | Public | Anti-cheat sanitized quiz questions (answers stripped) |
| `POST` | `/api/attempts/submit` | Authenticated | Server-side scoring, streak & badge evaluation |
| `GET` | `/api/attempts/:id` | Authenticated | Retrieve attempt with unlocked conceptual explanations |
| `GET` | `/api/achievements` | Public / Auth | List master badges with individual unlock progress |
| `GET` | `/api/leaderboard` | Public / Auth | Real-time standings (`global`, `weekly`, `monthly`) |
| `POST` | `/api/ai/generate` | Authenticated | Generate dynamic structured quiz via Gemini/OpenAI |
| `GET` | `/api/admin/stats` | Admin Only | Platform-wide operational analytics |
| `GET` | `/api/admin/users` | Admin Only | User accounts roster with search |
| `PATCH` | `/api/admin/users/:id/role`| Admin Only | Promote student to admin or demote |
| `DELETE`| `/api/admin/users/:id` | Admin Only | Delete user with cascading cleanup |
| `POST` | `/api/admin/quizzes` | Admin Only | Atomic multi-table quiz publication |
| `PATCH` | `/api/admin/quizzes/:id/status`| Admin Only | Toggle quiz Active / Draft status |

---

## 🧪 Automated Testing

Quiziverse includes a dedicated end-to-end integration test suite verifying all 10 core subsystems:
```bash
python3 scratch/e2e_integration_test.py
```
*(Tests cover RBAC guards, anti-cheat delivery, server scoring, streaks, levels, leaderboards, AI schemas, and rate bounds)*

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
