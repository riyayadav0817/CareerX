# CareerX — All-in-One Placement Preparation & Hiring Platform

CareerX is a production-grade, full-stack, responsive SaaS job portal and placement preparation ecosystem connecting job seekers with recruiters, employers, and top technology companies. Designed with a clean Indigo/Purple SaaS aesthetic, subtle gradients, soft shadows, rounded components, and interactive workflows.

---

## 🌟 Key Features

### 1. Job Seeker Experience
- **Candidate Profile & Resume Management**: Upload and update resumes (`.pdf`, `.doc`, `.docx`), download current resume, add skills tags, work experience, education history, and portfolio links (GitHub, LinkedIn, Portfolio).
- **Advanced Job Discovery**: Multi-faceted filtering by keyword, location, category, job type (Full-time, Part-time, Internship, Contract), work mode (Remote, Hybrid, On-site), experience level, salary range, and date posted.
- **1-Click Application Flow**: Apply using profile resume or upload a custom role-tailored resume with a personalized pitch/cover note.
- **Interactive Tracking**: Track live application status through all hiring stages:
  - `Applied`
  - `Under Review`
  - `Shortlisted`
  - `Interview Scheduled` (with date, time, video meeting link & interviewer notes)
  - `Rejected`
  - `Hired`
- **Application Withdrawal**: Functional 1-click withdrawal for pending applications.
- **Bookmarks & Saved Jobs**: Save jobs for later review.
- **Skill-Based Recommendations**: Automatic job matching based on candidate skills.
- **Notification Center**: Real-time notifications for status updates and interview schedules.

### 2. Recruiter & Employer Suite
- **Company Profile Management**: Upload company logos, manage company description, size, location, and website.
- **Job Vacancy Management**: Create rich job postings with category, work mode, salary benchmarks, responsibilities, qualifications, required skills, and perks.
- **Applicant Review & Candidate Tracking**:
  - Filter applicants by specific job posting or across all positions.
  - Search applicants by name, headline, or skills.
  - Inspect candidate profiles and download resumes directly.
  - Update application stages.
  - **Interactive Interview Scheduler**: Schedule video interviews with Google Meet / Zoom links, rounds, and candidate notes.

### 3. Platform Administration
- **KPI Metrics & Analytics**: Total users, recruiters, job seekers, active jobs, applications, and placement count.
- **User Management**: Search, filter by role/status, toggle user suspension, or remove accounts.
- **Job Moderation**: Review, approve, reject, or remove flagged job listings.
- **Company Verification**: Award or revoke verified badges for trustworthy organizations.

### 4. Placement Preparation Ecosystem
- **Placement Prep Hub (`/placement-prep`)**: Personalized preparation dashboard with learning streak, accuracy tracking, category readiness, weak topics, daily challenges, and upcoming placement goals.
- **Quantitative Aptitude (`/placement-prep/aptitude`)**: All 12 core topics with formulas, difficulty filters, interactive MCQs, and step-by-step explanations.
- **Logical Reasoning (`/placement-prep/reasoning`)**: 10 reasoning topics including Coding-Decoding, Blood Relations, Direction Sense, Seating Arrangements, Puzzles, Syllogisms, and Data Sufficiency.
- **Verbal Ability (`/placement-prep/verbal`)**: 8 topics covering Grammar, Vocabulary, Synonyms/Antonyms, Reading Comprehension, Sentence Correction, Para Jumbles, and Error Detection.
- **Coding & DSA Arena (`/placement-prep/coding`)**: Multi-language code editor (JavaScript, Python, Java, C++), sample & hidden test cases, submission history, and secure sandboxed execution (Judge0 / isolated Node VM).
- **Core CS Subjects (`/placement-prep/core-cs`)**: Study notes and MCQs for DBMS & SQL, Operating Systems, Computer Networks, OOP, Software Engineering, and Computer Architecture.
- **Timed Mock Tests (`/mock-tests`)**: Full placement simulators and company-specific assessments with countdown timer, question palette, mark-for-review, negative marking, auto-submission, and detailed scorecards.
- **Company-Specific Prep (`/company-prep`)**: 9 dedicated tracks for **TCS, Infosys, Wipro, Accenture, Capgemini, Cognizant, Amazon, Google, and Microsoft** with selection processes, exam patterns, and practice Q&A (labeled as practice material).
- **Interview Prep (`/interview-prep`)**: Interactive STAR method guide, HR & Technical interview Q&A, ATS resume checklist, and project pitch framework.
- **Seeker Dashboard Integration**: Dedicated **Placement Prep** tab inside the Job Seeker Dashboard showing readiness scores, daily challenge, weak topics, and mock test history.

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios, Canvas Confetti.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer.
- **Architecture**: Clean, modular MVC structure with separate routes, controllers, middleware, and schemas.

---

## 📂 Project Structure

```
D:\CareerX\
├── backend\
│   ├── config\            # Database connection (MongoDB)
│   ├── controllers\       # Business logic (auth, job, application, company, admin, notification)
│   ├── middleware\        # Auth verification, role protection & Multer file uploads
│   ├── models\            # Mongoose schemas (User, Company, Job, Application, SavedJob, Notification)
│   ├── routes\            # Express API endpoints
│   ├── seeds\             # Seed data script with realistic jobs, companies & demo users
│   ├── uploads\           # Uploaded resumes and company logos
│   ├── .env               # Environment configuration
│   ├── .env.example       # Example environment variables
│   ├── package.json
│   └── server.js          # Express entrypoint
│
├── frontend\
│   ├── src\
│   │   ├── components\    # Navbar, Footer, JobCard, ApplyModal, ProtectedRoute
│   │   ├── context\       # AuthContext with token persistence
│   │   ├── pages\         # Home, Jobs, JobDetail, Companies, Dashboards, Auth, Informative
│   │   ├── services\      # Axios client with JWT interceptors
│   │   ├── App.jsx        # Routing configuration
│   │   ├── index.css      # Tailwind base and design utilities
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd D:\CareerX\backend

# Install dependencies
npm install

# Seed sample job portal data (Companies, Jobs, Applications, Users)
npm run seed

# Seed Placement Prep data (36 MCQs, 6 Coding Problems, 6 Mock Tests, 9 Company Tracks)
node seeds/seedPlacementPrep.js

# Start development server
npm run dev
# or
npm start
```
The backend API runs on `http://localhost:5000`.

### Environment Variables (`D:\CareerX\backend\.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careerx_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
# Optional: Judge0 RapidAPI credentials for Python/Java/C++ code execution
# JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
# JUDGE0_API_KEY=your_rapidapi_key
```

### 2. Frontend Setup

```bash
cd D:\CareerX\frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend application will be live at `http://localhost:5173`.

---

## 🔑 Demo Accounts for Instant Testing

| Role | Email | Password | What You Can Test |
|---|---|---|---|
| **Job Seeker** | `seeker@careerx.com` | `password123` | Search jobs, 1-click apply, track 4 application stages, download resume, manage skills, withdraw application. |
| **Recruiter (Stripe)** | `recruiter@stripe.com` | `password123` | View Stripe applicants, update candidate stages, schedule video interviews, post new jobs. |
| **Recruiter (Google)** | `recruiter@google.com` | `password123` | Manage Google Cloud jobs, review candidate pipeline, edit company profile. |
| **Administrator** | `admin@careerx.com` | `admin123` | Overview KPIs, suspend/activate users, moderate job postings, verify companies. |

*Quick-fill buttons are also available on the `/login` page for convenience.*

---

## 🛡️ API Endpoints Summary

- `POST /api/auth/register` — Register as Candidate or Recruiter
- `POST /api/auth/login` — Sign in and get JWT token
- `GET /api/auth/me` — Get authenticated user details
- `PUT /api/auth/profile` — Update candidate profile & skills
- `POST /api/auth/upload-resume` — Upload resume file (PDF, DOCX)
- `GET /api/jobs` — Advanced search with filters (category, type, mode, salary, date)
- `GET /api/jobs/:id` — Job details & similar recommendations
- `POST /api/jobs` — Recruiter creates job posting
- `POST /api/applications/:jobId/apply` — Apply for position
- `GET /api/applications/my-applications` — Candidate application tracking
- `DELETE /api/applications/:id/withdraw` — Withdraw application
- `GET /api/applications/recruiter/applicants` — Recruiter applicants review
- `PUT /api/applications/:id/status` — Update stage & schedule interview
- `GET /api/companies` — Directory of hiring companies
- `GET /api/admin/stats` — Admin dashboard platform metrics
- `GET /api/admin/users` — Admin manage users
- `PUT /api/admin/jobs/:id/moderate` — Admin moderate job postings
- `GET /api/prep/dashboard` — Placement prep analytics, streaks & daily challenges
- `GET /api/prep/questions` — Filterable aptitude, reasoning, verbal & Core CS questions
- `POST /api/prep/practice-attempt` — Submit practice MCQ & update user readiness stats
- `GET /api/prep/practice-history` — Authenticated user's practice attempt history
- `GET /api/prep/coding/problems` — Coding & DSA challenge catalog
- `POST /api/prep/coding/:id/run` & `/api/prep/coding/:id/submit` — Sandboxed code execution & submission
- `GET /api/prep/mock-tests` — Mock test catalog
- `POST /api/prep/mock-tests/:id/submit` — Evaluate timed mock test & generate scorecard
- `GET /api/prep/mock-tests/history` — Authenticated user's mock test attempt history
- `GET /api/prep/companies` — Company-specific preparation tracks (9 companies)
- `GET /api/prep/interview-prep` — STAR method, HR, Technical & Resume preparation guides

---

## 🧪 Testing & Verification Steps

1. **Frontend Production Build**:
   ```bash
   cd D:\CareerX\frontend
   npm run build
   ```
   Confirms all JSX, Tailwind, and Vite chunks bundle cleanly with zero errors.
2. **Backend & MongoDB Health**:
   - Ensure MongoDB is running on `127.0.0.1:27017` and start `node server.js` inside `D:\CareerX\backend`.
3. **End-to-End Flow**:
   - Sign in at `/login` as `seeker@careerx.com` / `password123` (or register a new account).
   - Visit `/placement-prep`, solve an MCQ in `/placement-prep/aptitude`, and verify your streak/solved count updates in `/seeker/dashboard?tab=placement-prep`.
   - Take a timed test in `/mock-tests` and confirm the scorecard and attempt history persist after page reload.
   - Run JavaScript code in `/placement-prep/coding` using the built-in sandboxed VM runner (configure `JUDGE0_API_KEY` for Python/Java/C++ execution).
