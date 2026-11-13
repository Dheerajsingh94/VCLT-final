# VCLT → MERN Stack Migration Plan

> **Goal:** Convert the existing Express + EJS SSR application into a clean **MERN** stack (MongoDB + Express + React + Node.js) while preserving **100% of the current functionality**.

---

## Table of Contents

1. [Final Target Architecture](#1-final-target-architecture)
2. [Phase 0: Preparation & Critical Fixes](#2-phase-0-preparation--critical-fixes)
3. [Phase 1: Project Structure Setup](#3-phase-1-project-structure-setup)
4. [Phase 2: Backend Conversion (Express → Pure REST API)](#4-phase-2-backend-conversion-express--pure-rest-api)
5. [Phase 3: Frontend Conversion (EJS → React)](#5-phase-3-frontend-conversion-ejs--react)
6. [Phase 4: Detailed Feature Mapping (Old → New)](#6-phase-4-detailed-feature-mapping-old--new)
7. [Phase 5: Step-by-Step Execution Order](#7-phase-5-step-by-step-execution-order)
8. [Phase 6: Recommended Tech Choices](#8-phase-6-recommended-tech-choices)
9. [Phase 7: Things That Must Remain Exactly Same](#9-phase-7-things-that-must-remain-exactly-same)
10. [Extra Recommendations](#10-extra-recommendations)

---

## 1. Final Target Architecture

| Layer              | Technology                                      | Notes |
|--------------------|--------------------------------------------------|-------|
| Frontend           | React 18 + Vite + TypeScript (recommended)      | SPA |
| State Management   | React Context + Zustand / Redux Toolkit         | Auth, User, Call state |
| UI Library         | Tailwind CSS + Shadcn/UI or MUI                 | Modern, responsive |
| Routing            | React Router v6                                 | Protected routes |
| Backend            | Node.js + Express (ESM)                         | Pure REST API |
| Database           | MongoDB + Mongoose                              | Same schemas (with small improvements) |
| Auth               | JWT (Access + Refresh Token) + httpOnly cookies | Secure SPA auth |
| Real-time Video    | Agora RTC Web SDK                               | Same as current |
| Signaling + Chat   | Agora RTM SDK                                   | Same as current |
| Speech-to-Text     | Browser Web Speech API                          | Same (client-side) |
| Translation        | `@iamtraction/google-translate` or better alternative | Backend API |
| File Upload        | Multer + Cloudinary / local storage             | Profile pics |
| PDF Export         | `html2pdf.js` or `jspdf` + `html2canvas`        | Client-side |
| Environment        | dotenv + separate `.env` for frontend/backend   | Fix hardcoded secrets |

---

## 2. Phase 0: Preparation & Critical Fixes

Before starting conversion, fix these critical issues from the original analysis:

1. **Hardcoded Secrets** → Move everything to `.env`
2. **Global OTP variable** → Store OTP in MongoDB with TTL (or Redis)
3. **DOM repeating bug** in meeting notes & chat → Will be fixed naturally in React
4. **Missing `callRecordModel`** → Create proper model
5. **Disabled JWT middleware** → Re-enable properly

---

## 3. Phase 1: Project Structure Setup

Recommended monorepo structure:

```text
vclt-mern/
├── backend/                          # Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/                         # React + Vite
│   ├── src/
│   │   ├── api/                      # Axios instances & API functions
│   │   ├── components/
│   │   ├── contexts/                 # AuthContext, CallContext etc.
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```

Alternatively, keep them as two separate repositories.

---

## 4. Phase 2: Backend Conversion (Express → Pure REST API)

### 4.1 Keep / Improve Existing Models

Keep almost same schemas + add improvements:

- `User` model → Add `refreshToken`, `otp`, `otpExpiry`, `isEmailVerified`
- Create proper `CallRecord` / `RoomDetail` model (fix the crash)
- `Feedback`, `ReactivationRequest` remain same
- Add indexes on email, status, etc.

### 4.2 Convert All Routes to REST API

| Old Route (EJS)                  | New REST Endpoint                          | Method | Auth Required |
|----------------------------------|--------------------------------------------|--------|---------------|
| `/register` + `/userDetails`     | `/api/auth/register`                       | POST   | No            |
| `/verifyOTP`                     | `/api/auth/verify-otp`                     | POST   | No            |
| `/checkUser`                     | `/api/auth/login`                          | POST   | No            |
| `/logout`                        | `/api/auth/logout`                         | POST   | Yes           |
| `/forgetPassword` + OTP flow     | `/api/auth/forgot-password` + `/verify-reset-otp` + `/reset-password` | POST | No |
| `/viewprofile`                   | `/api/user/profile`                        | GET    | Yes           |
| `/updateprofile/:field`          | `/api/user/profile`                        | PATCH  | Yes           |
| `/photo`                         | `/api/user/profile-picture`                | POST   | Yes           |
| `/setSpokenLanguage` etc.        | `/api/user/languages`                      | PATCH  | Yes           |
| `/deactivate`                    | `/api/user/deactivate`                     | PATCH  | Yes           |
| `/sendRequest`                   | `/api/user/reactivation-request`           | POST   | No (or Yes)   |
| `/feedback`                      | `/api/feedback`                            | POST   | Yes           |
| `/translate/...`                 | `/api/translate`                           | POST   | Yes (optional)|
| `/checkroom`                     | `/api/rooms/join` or `/api/rooms`          | POST   | Yes           |
| `/viewHistory`                   | `/api/user/call-history`                   | GET    | Yes           |
| Admin routes                     | `/api/admin/*`                             | GET/PATCH | Admin only |

**Important:** All responses should be JSON. Never send HTML from backend.

### 4.3 Authentication Strategy for SPA

Recommended secure approach:

- Access Token → short-lived (15–30 min) → stored in memory or localStorage
- Refresh Token → long-lived → httpOnly + Secure cookie
- Or pure JWT in httpOnly cookies (with CSRF protection)

Use middleware:
- `authenticate` (JWT verification)
- `authorizeAdmin`
- `optionalAuth` (for some public routes)

### 4.4 OTP Handling Fix (Critical)

Never use global variable.

- **Option A (Simple):** Store OTP + expiry in User document  
- **Option B (Better):** Separate `OTP` collection with TTL index (auto-delete after 10 min)

---

## 5. Phase 3: Frontend Conversion (EJS → React)

### 5.1 Pages to Create (React Router)

**Public Pages:**
- `/` → Landing Page
- `/register`
- `/verify-otp`
- `/login`
- `/forgot-password`
- `/reset-password`

**Protected User Pages:**
- `/dashboard` (old `/main`)
- `/profile`
- `/profile/edit`
- `/history`
- `/lobby`
- `/room/:roomId` (main video call page)

**Admin Pages:**
- `/admin`
- `/admin/users`
- `/admin/requests`
- `/admin/feedbacks`

### 5.2 Key Components Structure

```text
components/
├── auth/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── OTPInput.jsx
│   └── ProtectedRoute.jsx
├── layout/
│   ├── Navbar.jsx
│   ├── AdminSidebar.jsx
│   └── Footer.jsx
├── video/
│   ├── VideoGrid.jsx
│   ├── LocalVideo.jsx
│   ├── RemoteVideo.jsx
│   ├── ControlsBar.jsx          // Mic, Cam, ScreenShare, Leave
│   ├── CaptionOverlay.jsx
│   ├── ChatSidebar.jsx
│   ├── MeetingNotes.jsx
│   ├── ParticipantsList.jsx
│   └── AudioRecorder.jsx
├── profile/
│   ├── ProfileCard.jsx
│   ├── LanguageSelector.jsx
│   └── ProfilePictureUpload.jsx
└── admin/
    ├── UsersTable.jsx
    ├── FeedbackTable.jsx
    └── RequestsTable.jsx
```

### 5.3 Real-time Video Call Implementation (Most Critical Part)

Keep the same Agora logic, just move to React:

1. Create a custom hook `useAgora` or `useVideoCall`
2. Initialize Agora RTC + RTM clients inside `useEffect`
3. Manage tracks (local audio/video, screen share) with `useState` + `useRef`
4. Speech Recognition → same `webkitSpeechRecognition` inside the hook
5. When speech detected → send via Agora RTM channel
6. On receiving RTM message of type `speech` → call `/api/translate` → show in `CaptionOverlay`
7. Meeting notes & chat → store in React state + localStorage (or backend if you want persistence)

**Important:** Screen share, focus/spotlight view, mute/unmute, leave meeting — sab same flow rakho.

### 5.4 PDF Export & Audio Recording

- Chat & Meeting Notes → React state mein rakho
- Use `html2pdf.js` or better `jspdf` + `html2canvas` on the modal content
- Audio Recorder → same MediaRecorder API inside a React component

---

## 6. Phase 4: Detailed Feature Mapping (Old → New)

| Feature                          | Old Implementation                  | New Implementation (MERN) |
|----------------------------------|-------------------------------------|---------------------------|
| Registration + OTP               | Cookie + global OTP                 | API + OTP in DB with expiry |
| Login / JWT                      | Cookie based                        | JWT + httpOnly cookies or localStorage |
| Profile Update                   | Multiple EJS forms                  | Single React form with PATCH |
| Language Preferences             | Separate GET routes                 | One PATCH `/api/user/languages` |
| Video Call Lobby                 | `lobby.ejs` + `lobby.js`            | React Lobby page + form |
| Agora RTC + RTM                  | `room_rtc.js` + `room_rtm.js`       | Custom React hooks |
| Live Translation                 | GET `/translate/...`                | POST `/api/translate` |
| Live Captions                    | DOM manipulation                    | React state + CaptionOverlay component |
| In-meeting Chat                  | RTM + DOM append                    | RTM + React state (no repeating bug) |
| Meeting Notes                    | Array + DOM re-append               | React state (clean) |
| Voice Recording                  | `vrecorder.js`                      | React component with MediaRecorder |
| Chat / Notes → PDF               | `html2pdf.js`                       | Same library in React |
| Admin Dashboard                  | Multiple EJS pages                  | React Admin layout + tables (TanStack Table recommended) |
| Call History                     | Broken (`callRecordModel` missing)  | Proper model + API |

---

## 7. Phase 5: Step-by-Step Execution Order

Give this order to your agent:

1. **Setup monorepo / separate folders** + install dependencies
2. **Backend first:**
   - Create models (fix + improve)
   - Setup dotenv, CORS, cookie-parser, error handling
   - Implement Auth routes (register, verify-otp, login, logout, forgot password)
   - Implement User profile routes
   - Implement Translate, Feedback, Room, Admin routes
   - Add proper JWT middleware + Admin guard
3. **Frontend setup:**
   - Vite + React + React Router + Tailwind + Axios
   - Create AuthContext + ProtectedRoute
   - Build all Auth pages first (Register → OTP → Login)
4. **Profile + Dashboard pages**
5. **Lobby + Room page** (most complex)
   - Integrate Agora RTC
   - Integrate Agora RTM
   - Speech Recognition + Translation flow
   - Chat + Notes + Controls + Screen Share
6. **Admin panel**
7. **PDF export + Audio recorder**
8. **Testing + Bug fixes**
9. **Deployment readiness** (environment variables, production build)

---

## 8. Phase 6: Recommended Tech Choices

- **Frontend Build:** Vite
- **Language:** TypeScript (strongly recommended)
- **UI:** Tailwind CSS + Shadcn/UI (or MUI if you prefer)
- **Forms:** React Hook Form + Zod
- **Tables (Admin):** TanStack Table
- **HTTP Client:** Axios
- **State:** Zustand (lightweight) or Redux Toolkit
- **Notifications:** React Hot Toast / Sonner
- **Icons:** Lucide React
- **Date/Time:** dayjs

---

## 9. Phase 7: Things That Must Remain Exactly Same

- Supported languages list
- Agora App ID usage pattern (but move to env)
- Speech recognition locales (`hi-IN`, `en-US` etc.)
- Translation flow (speech → RTM → backend translate → caption)
- Room code generation (4-digit random)
- Admin credentials flow (or improve it later)
- PDF content structure for chat & notes
- Account deactivation + reactivation request flow

---

## 10. Extra Recommendations

1. Replace `@iamtraction/google-translate` with official Google Cloud Translate or DeepL (more reliable)
2. Add rate limiting on Auth + Translate APIs
3. Add proper input validation (Joi / Zod on backend)
4. Store meeting notes & chat on backend if you want permanent history
5. Use Cloudinary for profile pictures instead of local disk
6. Add WebSocket or keep Agora RTM (current is fine)

---

**Created for:** VCLT Project Migration  
**Purpose:** Complete plan to convert existing Express + EJS application to modern MERN stack while keeping all original features intact.  
