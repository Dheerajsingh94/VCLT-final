# 🌐 VCLT — Video Call Language Translator (MERN Stack)

> **Complete MERN Stack Migration of the VCLT Application**  
> Converts the original Express + EJS SSR codebase into a high-performance, decoupled MERN architecture (MongoDB + Express + React 18 + Node.js) while preserving 100% of the original features and fixing all critical vulnerabilities.

---

## 🚀 Key Highlights & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Modern SPA with React Router v6 & Context API |
| **Backend** | Node.js (ESM) + Express | Pure REST API (100% JSON responses) |
| **Database** | MongoDB Atlas + Mongoose | Enhanced schemas with TTL auto-expiring OTPs |
| **Real-Time Video** | Agora RTC Web SDK | Low-latency adaptive audio/video & screen sharing |
| **Signaling & Chat** | Agora RTM SDK | Real-time chat & speech transcript broadcast |
| **Speech-to-Text** | Browser Web Speech API | Client-side continuous speech recognition |
| **Live Translation** | Multi-Tier AI Translation Engine | High-reliability instant multilingual translation |
| **Audio Recorder** | HTML5 `MediaRecorder` API | In-call voice note recording and .ogg/.webm download |
| **PDF Export** | `jspdf` | Single-click export of Meeting Notes & Chat Transcripts |
| **Security** | JWT + Bcrypt + Dotenv | Secure Bearer tokens & zero hardcoded secrets |

---

## 🛠️ Critical Issues Fixed from Original Code

1. **Hardcoded Secrets Removed**: All MongoDB URIs, JWT secrets, Agora App IDs, and Gmail SMTP credentials moved to secure `.env` configuration.
2. **Global OTP Collision Bug Eliminated**: Replaced the global module variable with a dedicated MongoDB `OTP` collection featuring a 10-minute TTL index (`expires: 600`).
3. **Meeting Notes & Chat DOM Multiplication Bug Fixed**: Converted manual `insertAdjacentHTML` loops into clean React reactive state arrays—eliminating repeated messages.
4. **Missing `callRecordModel` Crash Fixed**: Created standard `RoomDetail` model and controller queries, preventing server crashes during history retrieval.
5. **Re-enabled JWT Authentication Middleware**: Secured protected endpoints (`/api/user/*`, `/api/admin/*`, `/api/rooms/*`) with JWT verification.

---

## 📁 Project Structure

```text
VCLT/
├── backend/
│   ├── src/
│   │   ├── config/              # db.js (MongoDB Atlas connection with DNS fallback)
│   │   ├── controllers/         # authController, userController, roomController, translateController, adminController
│   │   ├── models/              # User, OTP, Feedback, ReactivationRequest, RoomDetail
│   │   ├── middlewares/         # authMiddleware (protect & adminOnly), uploadMiddleware (Multer)
│   │   ├── routes/              # authRoutes, userRoutes, roomRoutes, translateRoutes, adminRoutes
│   │   ├── utils/               # mailer.js, token.js, languages.js
│   │   ├── app.js               # Express app configuration & middleware
│   │   └── server.js            # Server entry point
│   ├── uploads/                 # Profile pictures storage
│   ├── .env                     # Backend environment configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios clients (auth, user, room, translate, admin)
│   │   ├── components/
│   │   │   ├── common/          # Modal, FeedbackModal
│   │   │   ├── layout/          # Navbar, ProtectedRoute
│   │   │   └── video/           # CaptionOverlay, ControlsBar, ChatDrawer, NotesDrawer, AudioRecorderModal, ParticipantsDrawer
│   │   ├── contexts/            # AuthContext (global user state, login, logout)
│   │   ├── hooks/               # useAgora (RTC/RTM), useSpeechRecognition
│   │   ├── pages/               # LandingPage, RegisterPage, VerifyOtpPage, LoginPage, ForgotPasswordPage, ResetPasswordPage, DashboardPage, ProfilePage, CallHistoryPage, LobbyPage, RoomPage, AdminDashboardPage
│   │   ├── utils/               # languages.js, pdfExport.js
│   │   ├── App.jsx              # Routing & protected routes configuration
│   │   ├── index.css            # Modern glassmorphism dark mode design system
│   │   └── main.jsx
│   ├── public/                  # Static assets & agora-rtm.js
│   ├── vite.config.js           # Vite config with backend proxy
│   └── package.json
│
└── README.md
```

---

## 🌐 Supported Languages

- **English** (`en-US` / `en`)
- **Hindi** (`hi-IN` / `hi`)
- **Marathi** (`mr-IN` / `mr`)
- **Tamil** (`ta-IN` / `ta`)
- **Gujarati** (`gu-IN` / `gu`)
- **Telugu** (`te-IN` / `te`)
- **Bengali** (`bn-IN` / `bn`)
- **Kannada** (`kn-IN` / `kn`)
- **Malayalam** (`ml-IN` / `ml`)

---

## 💻 Running the Project Locally

### 1. Backend Server (Port 5000)
```bash
cd backend
npm install
node src/server.js
```
*Health Check: `http://localhost:5000/api/health`*

### 2. Frontend Development Server (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Open Application: `http://localhost:5173/`*

---

## 🔑 Default Administrator Credentials

- **Email:** `admin@gmail.com`
- **Password:** `Admin@123`
- **Admin Console URL:** `http://localhost:5173/admin`
