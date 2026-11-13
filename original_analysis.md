# 📌 VCLT (Video Call Language Translator) - Complete Project Analysis & Feature Documentation

> **Dokument Ka Udeshya (Purpose):**  
> Yeh document VCLT project ka complete in-depth analysis pradan karta hai. Isme system architecture, existing features, database models, API routes, client-side workflows, aur known issues/improvement recommendations shamil hain, taaki aap isme aasaani se naye changes ya enhancements karva sakein.

---

## 📑 Table of Contents (Vishay Suchi)
1. [Project Overview & Core Value Proposition](#1-project-overview--core-value-proposition)
2. [Technology Stack](#2-technology-stack)
3. [Project Directory & File Structure](#3-project-directory--file-structure)
4. [Complete Feature Breakdown (Module-wise)](#4-complete-feature-breakdown-module-wise)
   - [4.1 Authentication & User Lifecycle](#41-authentication--user-lifecycle)
   - [4.2 User Profile & Preference Management](#42-user-profile--preference-management)
   - [4.3 Real-Time Video Calling (Agora RTC)](#43-real-time-video-calling-agora-rtc)
   - [4.4 Speech Recognition & Real-Time Live Translation](#44-speech-recognition--real-time-live-translation)
   - [4.5 In-Meeting Chat & Collaborative Features](#45-in-meeting-chat--collaborative-features)
   - [4.6 Voice Audio Recording & PDF Exports](#46-voice-audio-recording--pdf-exports)
   - [4.7 Admin Dashboard & Moderation](#47-admin-dashboard--moderation)
5. [Complete API Routes & Endpoints Reference](#5-complete-api-routes--endpoints-reference)
6. [Database Schema & Data Models (MongoDB)](#6-database-schema--data-models-mongodb)
7. [Architecture & Workflow Diagrams](#7-architecture--workflow-diagrams)
8. [Critical Bugs, Security Risks & Areas Needing Immediate Fixes](#8-critical-bugs-security-risks--areas-needing-immediate-fixes)
9. [Recommended Enhancements & Roadmap for Future Changes](#9-recommended-enhancements--roadmap-for-future-changes)

---

## 1. Project Overview & Core Value Proposition

**VCLT (Video Call Language Translator)** ek full-stack real-time video communication platform hai jo language barriers ko khatam karne ke liye banaya gaya hai.

### Mukhya Khasiyat (Key Highlights):
- **Peer-to-Peer & Multi-Party Video Calling:** Agora RTC SDK ke through high-quality audio aur video calling support karta hai.
- **Live Speech-to-Text & Real-time Translation:** Jab koi user apni bhasha mein bolta hai, browser Web Speech API usko text mein convert karta hai aur backend translation engine (`@iamtraction/google-translate`) usko samne wale user ki pasandida language mein translate karke subtitles/captions ke roop mein live screen par dikhata hai.
- **Meeting Notes & Chat Transcripts to PDF:** Meeting ke dauran boli gayi baatein aur chat history ko ek click mein PDF format mein download kiya ja sakta hai.
- **Account & Admin Management:** OTP-based verification, password recovery, profile editing, feedback collection, account deactivation/reactivation requests, aur ek dedicated Admin panel.

---

## 2. Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend Framework** | Node.js (ES Modules), Express.js (v4.18.2) |
| **Template Engine (SSR)** | EJS (Embedded JavaScript templates) |
| **Database & ODM** | MongoDB, Mongoose (v7.5.3) |
| **Video & Audio Calling** | Agora RTC Web SDK (`AgoraRTC_N-4.11.0.js`) |
| **Real-Time Signaling & Chat** | Agora RTM SDK (`agora-rtm-sdk-1.4.4.js`) |
| **Speech-to-Text (STT)** | Browser Web Speech API (`webkitSpeechRecognition`) |
| **Language Translation** | `@iamtraction/google-translate` (v2.0.1) |
| **Authentication & Security** | JSON Web Tokens (`jsonwebtoken`), `bcrypt` (password hashing), `cookie-parser`, `express-session` |
| **Mailing Service** | `nodemailer` (Gmail SMTP service) |
| **File Handling** | `multer` (Profile pictures disk storage) |
| **PDF Generation** | `html2pdf.js` (Client-side HTML to PDF) |
| **Voice Audio Recording** | Native HTML5 `MediaRecorder` API |
| **Frontend UI & Styling** | Bootstrap 5, FontAwesome 6, jQuery DataTables, Custom CSS |

---

## 3. Project Directory & File Structure

```text
vclt_web/
├── implementation_plan_23_09_7_30PM      # Reference plan
├── landing_page_design.md                # Landing page reference
├── totaljobs_flow_analysis_22_09         # Reference analysis
└── vclt_web/                             # Main Application Directory
    ├── app.js                            # Express Server entry point & middlewares
    ├── package.json                      # Dependencies & NPM scripts
    ├── ReadIt.txt                        # Developer changelog notes
    ├── ex.js                             # Testing/experiment scratchpad
    │
    ├── controller/                       # Controller Business Logic
    │   ├── userController.js             # User auth, profile, languages, feedback, calls
    │   └── adminController.js            # Admin user management, feedbacks, requests
    │
    ├── model/                            # Mongoose Database Schemas
    │   ├── connection.js                 # MongoDB connection setup
    │   ├── usermodel.js                  # User schema & profile attributes
    │   ├── messagemodel.js               # Account activation request schema
    │   ├── feedbackmodel.js              # User rating & feedback schema
    │   ├── roomDetailModel.js            # Call room details schema
    │   └── upload.js                     # Multer configuration for file uploads
    │
    ├── routes/                           # Express Routing
    │   ├── user.js                       # User and meeting routes
    │   └── adminRoutes.js                # Admin management routes
    │
    ├── views/                            # EJS Templates
    │   ├── pages/
    │   │   ├── index.ejs                 # Public Landing / Home page
    │   │   ├── register.ejs              # User Registration page
    │   │   ├── verifyOTP.ejs             # Registration OTP confirmation page
    │   │   ├── login.ejs                 # Sign-in page (with request-for-active modal)
    │   │   ├── main.ejs                  # Authenticated Dashboard / Start call page
    │   │   ├── forgetPassword.ejs        # Forgot password request page
    │   │   ├── passwordOTP.ejs           # Password reset OTP page
    │   │   ├── changePassword.ejs        # New password entry page
    │   │   ├── userProfile.ejs           # Profile details & language selection
    │   │   ├── editProfile.ejs           # Profile field update page
    │   │   ├── manageProfile.ejs         # Account deactivation warning & action
    │   │   ├── userViewHistory.ejs       # Call history list
    │   │   ├── adminmainpage.ejs         # Admin Dashboard landing
    │   │   ├── adminViewUser.ejs         # Admin: View & Activate/Deactivate users
    │   │   ├── adminViewRequest.ejs      # Admin: Account reactivation requests
    │   │   ├── adminViewFeedback.ejs     # Admin: User feedback & ratings
    │   │   └── desktop_3.ejs             # Registration alternative layout
    │   │
    │   ├── partial/                      # Reusable UI Partials
    │   │   ├── headElement.ejs           # Common HTML <head> scripts & meta
    │   │   ├── mainpageheader.ejs        # Public navigation header
    │   │   ├── mainpageheader1.ejs       # Authenticated header with user dropdown & feedback modal
    │   │   ├── signinheader.ejs          # Sign-in header
    │   │   ├── signupheader.ejs          # Sign-up header
    │   │   └── adminmainpageheader.ejs   # Admin topbar header
    │   │
    │   └── videochat/                    # Video Calling Templates
    │       ├── lobby.ejs                 # Meeting lobby to enter display name & room code
    │       ├── room.ejs                  # Standard video call room template
    │       └── room2.ejs                 # Active video call room with translation, notes, chat modals
    │
    └── public/                           # Static Assets (Images, CSS, JS)
        ├── css/                          # Stylesheets (main.css, room.css, lobby.css, styles.css)
        ├── images/                       # Uploaded avatars, logos, illustrations
        └── js/                           # Client-side scripts
            ├── AgoraRTC_N-4.11.0.js      # Agora RTC client bundle
            ├── agora-rtm-sdk-1.4.4.js    # Agora RTM client bundle
            ├── lobby.js                  # Lobby form validation & room redirect
            ├── room.js                   # Video grid collapse/expand & sidebar toggle
            ├── room_rtc.js               # RTC streams, camera, mic, screen-share, speech recognition
            ├── room_rtm.js               # RTM messaging, live translation captions, meeting notes
            ├── vrecorder.js              # Native audio recording controls
            ├── myScript.js               # Registration form validation
            ├── edit.js                   # Edit profile client validation
            └── dateTime.js               # Real-time clock utility
```

---

## 4. Complete Feature Breakdown (Module-wise)

### 4.1 Authentication & User Lifecycle
1. **User Registration (`/register`, `/userDetails`):**
   - User apna Full Name, Birth Year, Email, Password, aur Confirm Password enter karta hai.
   - Client-side validation (`myScript.js`) regex dwara name, email structure, password strength (minimum 8 characters, upper/lower/digit), aur 4-digit birth year check karta hai.
   - Check karta hai ki email database mein pehle se maujood toh nahi hai.
   - 4-digit random numeric OTP generate karta hai aur user ke email par Nodemailer SMTP ke zariye send karta hai.
   - Unverified data ko temporary cookie (`temp`) mein store karta hai.
2. **OTP Email Verification (`/verifyOTP`, `/main`, `checkOTP`):**
   - 4 auto-advancing OTP input boxes render hote hain (user type karta hai toh focus automatically agle box par shift hota hai, aur backspace se previous par).
   - OTP match hone par password ko `bcrypt.hash(password, 10)` se hash karta hai aur user document MongoDB mein status `"activate"` ke saath create hota hai.
   - User ke liye 1-day JWT token create hota hai aur HTTP-only cookie (`jwt`, `email`) mein set hota hai.
3. **User Sign In (`/login`, `/checkUser`):**
   - User email aur password se login karta hai.
   - `bcrypt.compare` ke zariye hashed password verify hota hai.
   - **Account Status Guard:** Agar user ka status `"deactivate"` hai, toh login block ho jata hai aur user ko "Request for active" ka modal link milta hai.
   - **Admin Login:** Agar user `admin@gmail.com` aur password `Admin@123` enter karta hai, toh woh directly Admin Dashboard par redirect ho jata hai.
4. **Forgot Password Flow (`/forgetPassword`, `/sendpasswordOTP`, `/changePassword/:email`, `/checkPassword/:email`):**
   - Registered email input karne par 4-digit OTP email par bheja jata hai.
   - OTP verify hone ke baad user se naya password maanga jata hai.
   - Naye password ko hash karke database mein update kar diya jata hai aur user auto-login ho jata hai.
5. **Logout (`/logout`):**
   - JWT aur Email cookies ko clear karke landing page (`/`) par redirect karta hai.

---

### 4.2 User Profile & Preference Management
1. **Profile Overview (`/viewprofile`):**
   - User ka avatar/profile picture, username, birthdate, gender, email (read-only), contact number, home address, aur bhasha preferences show karta hai.
2. **Inline Profile Updating (`/updateprofile/:field`):**
   - Username, Birthdate, Gender (Male / Female / Other), Contact Number, Address ko independently edit karne ki suvidha.
   - **Change Password:** Profile ke andar se purana password enter karke naya password set karne ka option.
3. **Profile Picture Upload (`/photo`):**
   - Multer middleware ke zariye image upload hokar `public/images/` folder mein store hoti hai aur filename database mein save hota hai.
4. **Language Preferences Setting:**
   - User apni **Spoken Language** (jo woh bolega) aur **Caption Language** (jisme woh subtitles dekhna chahta hai) dropdown se chun sakta hai:
     - *Supported Languages:* English, Hindi, Marathi, Tamil, Gujarati, Telugu, Bengali, Kannada, Malayalam.
   - Yeh preferences user document mein save hoti hain aur live video call ke dauran dynamically fetch hoti hain.
5. **Account Deactivation (`/manageprofile/deactivate`, `/deactivate`):**
   - User ko data loss aur limitations ki warning dikhayi jaati hai.
   - Confirm karne par user status `"deactivate"` ho jata hai aur session destroy ho jata hai.
6. **Account Reactivation Request (`/sendRequest`):**
   - Deactivated user login page par modal ke zariye admin ko request message aur email bhej sakta hai (yeh `messagemodel` mein save hota hai).
7. **User Feedback (`/feedback`):**
   - Authenticated header mein "Feedback" button hai jo 1 se 5 star rating aur suggestion message input karne ka modal kholta hai. Feedback database (`feedbackmodel`) mein save hota hai.

---

### 4.3 Real-Time Video Calling (Agora RTC)
1. **Lobby Interface (`/lobby`, `/videochat`):**
   - User Room Name (Invite Code) enter kar sakta hai ya blank chhodne par random 4-digit room code generate hota hai.
   - Display name session storage mein save ho jata hai.
2. **RTC Channel Connection (`room2.ejs`, `room_rtc.js`):**
   - Agora RTC Client initialize hota hai (App ID: `acfe33308b7040beb8d22822d438123f`, mode: `rtc`, codec: `vp8`).
   - Camera aur Microphone streams publish hoti hain (Resolution: 640x480 se 1920x1080 tak adaptive).
   - Naye participants join hone par remote streams dynamically DOM mein render hoti hain.
3. **In-Call Stream Controls:**
   - **Camera Toggle:** Video track ko mute/unmute karta hai.
   - **Mic Toggle:** Audio track ko mute/unmute karta hai aur sath hi speech recognition engine ko start/stop karta hai.
   - **Screen Sharing:** User apna display/window screen share kar sakta hai (`AgoraRTC.createScreenVideoTrack()`). Screen share active hone par camera track temporarily unpublish ho jata hai aur screen stream main stage par aa jati hai.
   - **Focus / Spotlight View:** Kisi bhi participant ke video frame par click karne se woh enlarged main frame mein switch ho jata hai aur baki participants thumbnail strip mein chale jate hain.
   - **Leave Meeting:** RTC tracks close karta hai, channel chhodta hai aur lobby par redirect karta hai.

---

### 4.4 Speech Recognition & Real-Time Live Translation
*Yeh project ka sabse unique feature hai:*
1. **Speech Recognition (`startSpeechRecog`):**
   - Jab mic ON hota hai, browser ka `webkitSpeechRecognition` trigger hota hai.
   - User ki saved `spokenlanguage` database se fetch ki jaati hai aur corresponding locale code set hota hai:
     - English: `en-US`, Hindi: `hi-IN`, Marathi: `mr-IN`, Tamil: `ta-IN`, Gujarati: `gu-IN`, Telugu: `te-IN`, Bengali: `bn-IN`, Kannada: `kn-IN`, Malayalam: `ml-IN`.
   - Continuous recognition mode mein user ke boli gayi awaz ko real-time text transcript mein convert karta hai.
2. **Signaling via Agora RTM:**
   - Captured transcript ko Agora RTM channel par broadcast kiya jata hai:
     ```javascript
     channel.sendMessage({ text: JSON.stringify({ type: 'speech', message: message, displayName: displayName, speechCode: speechcode }) })
     ```
3. **Backend Live Translation Engine (`/translate/:message/:speechcode/:captioncode`):**
   - Receiving clients incoming RTM message receive karte hain.
   - Client apni local `captioncode` (e.g. `hi`, `en`, `mr`, `ta` etc.) ke sath backend API `/translate/...` ko call karta hai.
   - Backend `@iamtraction/google-translate` library ke zariye text ko sender ki language se receiver ki preferred language mein translate karta hai.
4. **Live Subtitle Display (`#caption__container`):**
   - Translated text real-time mein video call window ke niche transparent caption overlay box mein speaker ke naam ke sath display hota hai.

---

### 4.5 In-Meeting Chat & Collaborative Features
1. **Real-Time Sidebar Chat (`room_rtm.js`):**
   - Agora RTM channel messaging ke zariye text chat.
   - Message author name aur formatted time-stamp ke sath message bubbles show hote hain.
   - Auto-scroll to latest message.
2. **Participants Roster:**
   - Real-time online participant count (`#members__count`).
   - Members list with active online indicator badge.
   - Bot welcome announcements jab koi member room join ya leave karta hai (`VCLT BOT <room>`).
3. **Meeting Notes Synchronization:**
   - Har translated caption automatically meeting notes log mein collect hota rehta hai.

---

### 4.6 Voice Audio Recording & PDF Exports
1. **In-Meeting Voice Audio Recording (`vrecorder.js`):**
   - Modal ke andar ek standalone Audio Recorder tool diya gaya hai jo HTML5 `navigator.mediaDevices.getUserMedia({ audio: true })` aur `MediaRecorder` use karta hai.
   - States: `Initial` -> `Record` (recording in progress) -> `Download` (audio player appears with link to download `.ogg` audio recording).
2. **Export Chat to PDF (`chatDownload`):**
   - "Show Chat" modal khol kar user poori meeting chat history dekh sakta hai.
   - `html2pdf.js` library ke dwara "Download" button dabate hi chat transcript formatted PDF file mein download ho jati hai.
3. **Export Meeting Notes to PDF (`notesDownload`):**
   - "Show Meeting Notes" modal ke andar meeting ke dauran hue speech captions time-stamped format mein ikatthe hote hain.
   - User ek click mein complete Meeting Minutes / Notes ko PDF format mein download kar sakta hai.

---

### 4.7 Admin Dashboard & Moderation
- **Admin Access:** Login page par `admin@gmail.com` / `Admin@123` daalne par access hota hai.
- **Admin Navigation (`/admin`):**
  - **View Users (`/admin/adminViewUser`):** Registered users ki list (Name, Birth Year, Email, Status). Kisi bhi user ko ek click mein Activate ya Deactivate karne ka toggle button.
  - **Account Reactivation Requests (`/admin/adminViewRequest`):** Blocked/deactivated users dwara bheji gayi requests aur unke messages dekhna, aur wahi se account ko reactivate karna.
  - **View Feedbacks (`/admin/adminViewFeedbacks`):** Sabhi users dwara submit ki gayi 1-5 star ratings aur comments ko jQuery DataTable (sorting + searching) mein dekhna.

---

## 5. Complete API Routes & Endpoints Reference

### User & Meeting Routes (`/routes/user.js`)

| Method | Endpoint | Description | Middleware / Handler |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Home / Landing Page (JWT check to redirect to `/main`) | Inline Handler |
| `GET` | `/register` | Render User Registration page | Inline Handler |
| `POST`| `/userDetails` | Register user details & send 4-digit verification OTP | `registerroute` |
| `GET` | `/login` | Render Login Page | Inline Handler |
| `POST`| `/checkUser` | Authenticate user or admin & set cookies | `loginroute` |
| `GET` | `/forgetPassword` | Render Forgot Password email entry page | Inline Handler |
| `POST`| `/sendpasswordOTP` | Send 4-digit OTP for password reset | `forgetPasswordController` |
| `POST`| `/changePassword/:email` | Verify password OTP & show new password form | Inline Handler |
| `POST`| `/checkPassword/:email` | Update new hashed password in DB | `checkPasswordController` |
| `GET` | `/main` | Authenticated Dashboard / Start Meeting | `authenticateJWT`, `authorizeUser`, `checkOTP` |
| `GET` | `/logout` | Clear JWT & email cookies | Inline Handler |
| `GET` | `/viewprofile` | View user profile details & preferences | `viewProfileController` |
| `GET` | `/updateprofile/:field` | Render edit form for specific field (name, birthday, gender, etc.) | `editProfileController` |
| `POST`| `/updateprofile/:field` | Save updated field values in DB | `editProfileController2` |
| `GET` | `/manageprofile/:field` | Manage account / Show deactivation warning | `manageProfileController` |
| `POST`| `/photo` | Upload profile image via Multer | `upload`, `profilePictureController` |
| `GET` | `/deactivate` | Set user status to 'deactivate' | `deactivateAccountController` |
| `GET` | `/videochat` | Render Lobby to create/join meeting | Inline Handler |
| `GET` | `/lobby` | Render Meeting Lobby | Inline Handler |
| `GET` | `/room` | Render Video Chat Room (`room2.ejs`) with invite code | Inline Handler |
| `GET` | `/translate/:message/:speechcode/:captioncode` | Translate message using Google Translate API | Inline Handler (`@iamtraction/google-translate`) |
| `GET` | `/setSpokenLanguage/:field` | Update preferred spoken language | `setSpokenLanguageController` |
| `GET` | `/setCaptionLanguage/:field` | Update preferred caption language | `setCaptionLanguageController` |
| `GET` | `/spoken-language/:field` | JSON endpoint returning user's spoken language | `spokenLanguageController` |
| `GET` | `/caption-language/:field` | JSON endpoint returning user's caption language | `captionLanguageController` |
| `GET` | `/viewHistory` | View user call history records | `userViewHistoryController` |
| `POST`| `/feedback` | Submit 5-star rating & feedback message | `userFeedbackController` |
| `POST`| `/sendRequest` | Submit account reactivation request | `sendRequestcontroller` |
| `GET` | `/checkroom` | Record user participation in a room | `checkRoomController` |

### Admin Routes (`/routes/adminRoutes.js`)

| Method | Endpoint | Description | Handler |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin` | Render Admin Dashboard Main Page | Inline Handler |
| `GET` | `/admin/adminViewUser` | View all users table | `adminViewUserController` |
| `GET` | `/admin/deactivate/:email` | Toggle user status (activate <-> deactivate) | `adminDeactivateUser` |
| `GET` | `/admin/adminViewRequest` | View user account reactivation requests | `adminViewRequestController` |
| `GET` | `/admin/adminViewFeedbacks`| View user feedback & star ratings table | `adminViewFeedbackController` |

---

## 6. Database Schema & Data Models (MongoDB)

### 1. User Model (`usermodel.js`)
```javascript
{
  username:        { type: String, required: true },
  profile:         { type: String, required: false }, // Filename in public/images
  birthyear:       { type: Number, required: true },
  email:           { type: String, required: true, unique: true },
  birthdate:       { type: String, required: false },
  contactNumber:   { type: Number, required: false },
  address:         { type: String, required: false },
  password:        { type: String, required: true },  // Bcrypt hashed
  status:          { type: String, required: true },  // "activate" | "deactivate"
  gender:          { type: String, enum: ["Male", "Female", "Other"] },
  captionlanguage: { type: String, default: "Hindi" },
  spokenlanguage:  { type: String, default: "English" }
}
```

### 2. Message / Reactivation Request Model (`messagemodel.js`)
```javascript
{
  message: { type: String, required: true },
  email:   { type: String, required: true }
}
```

### 3. Feedback Model (`feedbackmodel.js`)
```javascript
{
  email:           { type: String, required: true },
  rating:          { type: String, required: true }, // "1" to "5"
  feedbackmessage: { type: String, required: true }
}
```

### 4. Room Detail Model (`roomDetailModel.js`)
```javascript
{
  roomname:     { type: String },
  creationdate: { type: String },
  participants: { type: [String] }
}
```

---

## 7. Architecture & Workflow Diagrams

### A. Real-Time Speech Translation Flow
```
User A (Speaks in Hindi) 
   │
   ▼
Browser Web Speech Recognition (webkitSpeechRecognition lang="hi-IN")
   │
   ▼
Text Transcript: "नमस्ते, आप कैसे हैं?"
   │
   ▼
Agora RTM Channel Broadcast (type: 'speech', speechCode: 'hi-IN')
   │
   ▼
User B Receives RTM Signal (Prefers English Captions, captionCode: 'en')
   │
   ▼
HTTP GET /translate/नमस्ते.../hi/en
   │
   ▼
Node.js Server (@iamtraction/google-translate)
   │
   ▼
Response: "Hello, how are you?"
   │
   ▼
Live Subtitle Box (#caption__container) on User B Screen
   │
   ▼
Appended to "Meeting Notes" (Downloadable as PDF)
```

### B. User Registration & OTP Flow
```
User fills Form (register.ejs)
   │
   ▼
POST /userDetails -> Generate 4-digit OTP -> Nodemailer sends Email
   │
   ▼
Temp Cookie Saved -> Redirect to /verifyOTP
   │
   ▼
User enters 4-digit OTP -> POST /main (checkOTP)
   │
   ├── OTP Matches ──> Bcrypt Hash Password ──> Save User to MongoDB
   │                     └──> Sign JWT Cookie ──> Redirect to /main
   └── OTP Fails   ──> Re-render with "OTP Not Match" error
```

---

## 8. Critical Bugs, Security Risks & Areas Needing Immediate Fixes

Jab aap is project mein changes karenge, toh in **5 mahatvapurna kamiyon (vulnerabilities/bugs)** ko zaroor theek karein:

1. ⚠️ **Hardcoded Secrets & Plaintext Credentials (High Security Risk):**
   - `connection.js`: MongoDB Atlas URI with database username aur password hardcoded hai (`mongodb+srv://mohitbasediyaa:wzlyfHYUTP0dC6cD@...`).
   - `userController.js` & `adminController.js`: Gmail App Password plaintext mein hardcoded hai (`user: "vishnitin51@gmail.com", pass: "cawg prrm wihh fduo"`).
   - `userController.js`: JWT Secret key plaintext string hai.
   - `room_rtc.js`: Agora App ID publicly client script mein exposed hai.
   - **Fix:** Inhe `.env` file mein shift karein aur `dotenv` package use karein.

2. ⚠️ **Global OTP Variable Overwrite Bug (Concurrency Bug):**
   - `userController.js` mein line 12 par `export var otp;` ek global module variable hai.
   - Agar do user ek hi samay register ya password reset karenge, toh ek user ka OTP dusre user ke OTP ko overwrite kar dega!
   - **Fix:** OTP ko Redis, MongoDB collection (with TTL expiry), ya encrypted session cookie mein store karein.

3. ⚠️ **Exponential DOM Appending Bug in Notes & Chat (`room_rtm.js`):**
   - Lines 178–199 aur 227–249 mein:
     ```javascript
     meetingNotes.forEach(note => { meetingNotesBody.insertAdjacentHTML('beforeend', meetingNoteHTML); });
     ```
     Har naye caption ya chat message par poora array shuru se wapas append hota hai bina purane content ko clear kiye (`meetingNotesBody.innerHTML = ''`). Isse messages screen par 1x, 2x, 4x, 8x multiply hokar repeat hote hain.
   - **Fix:** Loop chalane se pehle container ko empty karein ya sirf naya message DOM mein insert karein.

4. ⚠️ **Crash in Call History (`userViewHistoryController`):**
   - `userController.js` line 668 par `callRecordModel` use ho raha hai, lekin `callRecordModel` na toh model folder mein maujood hai aur na import kiya gaya hai. Is page (`/viewHistory`) par click karne par server crash ho sakta hai (`ReferenceError: callRecordModel is not defined`).
   - **Fix:** `callRecordModel` create karein ya `roomDetailModel` ko query karein.

5. ⚠️ **Disabled JWT Authentication Middleware:**
   - `userController.js` mein `authenticateJWT` aur `authorizeUser` ke andar JWT verification code comment out kiya hua hai aur directly `next()` call ho raha hai. Iska matlab unauthenticated user bhi protected routes par access kar sakta hai agar proper check na ho.
   - **Fix:** JWT verification logic ko re-enable karein aur invalid/expired token par `/login` redirect karein.

---

## 9. Recommended Enhancements & Roadmap for Future Changes

Aap is project ko modern aur production-ready banane ke liye niche diye gaye features add karwa sakte hain:

### Phase 1: Stability & Security (Immediate)
- [ ] `.env` file setup karke credentials secure karna.
- [ ] OTP collision bug ko fix karna (Session/DB TTL based OTP).
- [ ] Meeting notes aur chat history ke DOM repeating bug ko fix karna.
- [ ] JWT authentication guards ko sabhi protected routes par strictly apply karna.

### Phase 2: User Experience & Design Upgrade
- [ ] **Modern UI/UX:** Bootstrap 5 ke generic controls ko ek sleek Dark/Light glassmorphism dashboard se replace karna.
- [ ] **Live Audio Transcription Quality:** Browser Web Speech API ke fallback ke liye Whisper API ya Deepgram API integrate karna (kyunki Web Speech API sirf Chrome/Edge mein best chalti hai).
- [ ] **Mobile Responsiveness:** Video call controls aur chat drawers ko mobile viewports ke liye optimize karna.

### Phase 3: Advanced Video Call Features
- [ ] **Call Recording to Cloud/Server:** Abhi sirf voice record hoti hai; Agora Cloud Recording ya screen recording canvas stream save karne ki suvidha.
- [ ] **Virtual Backgrounds & Blur:** Agora Video extension se background blur feature.
- [ ] **Hand Raise & Emoji Reactions:** Real-time emoji floating reactions over Agora RTM.
- [ ] **Scheduled Meetings & Calendar Invites:** Meeting schedule karke direct Google/Outlook calendar link ya email invite bhejna.

---
*Created by Antigravity AI for Dheeraj Singh Chouhan — VCLT Project Analysis.*
