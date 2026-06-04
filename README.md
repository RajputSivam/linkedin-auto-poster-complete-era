# 🚀 LinkedIn Auto-Poster

<div align="center">

![LinkedIn Auto-Poster Banner](https://img.shields.io/badge/LinkedIn-Auto--Poster-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)

**A full-stack MERN + GenAI web application that tracks your weekly coding activity across platforms, generates engaging LinkedIn posts using Google Gemini, and publishes them automatically — or after your approval.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://linkedin-auto-poster-complete-era.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/RajputSivam/linkedin-auto-poster-complete-era)
![JavaScript](https://img.shields.io/badge/JavaScript-98.9%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🧠 Overview

LinkedIn Auto-Poster automates your professional content creation by:

1. **Tracking** your weekly coding activity (GitHub commits, LeetCode/Codeforces/CodeChef solutions)
2. **Generating** professional LinkedIn posts via Google Gemini AI
3. **Publishing** automatically every Sunday at 9 PM IST — or sending you a preview for approval first

No more manually writing LinkedIn posts. Just code, and let the app do the storytelling.

---

## ✨ Features

- 🔐 **LinkedIn OAuth** — Secure login via Passport.js LinkedIn strategy
- 📊 **Activity Tracking** — Fetches coding stats from GitHub, LeetCode, Codeforces, CodeChef
- 🤖 **AI Post Generation** — Google Gemini crafts engaging, human-sounding posts
- ✅ **Approval Mode** — Preview & edit generated posts before publishing
- ⚡ **Auto-Publish Mode** — Fully automated, zero manual effort
- 🖼️ **Image Support** — Cloudinary integration for post media uploads
- 🕘 **Scheduled Jobs** — node-cron fires every Sunday at 9 PM IST
- 🔒 **JWT Authentication** — Secure session management
- 📱 **Responsive UI** — Clean React + Tailwind CSS frontend

---

## 🛠 Tech Stack

### Frontend (`client/`)
| Technology | Purpose |
|---|---|
| React + Vite | UI framework & build tool |
| Tailwind CSS | Styling |
| Axios | HTTP client |

### Backend (`server/`)
| Technology | Purpose |
|---|---|
| Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Passport.js (LinkedIn OAuth) | Authentication |
| JWT + bcrypt | Token auth & password hashing |
| Google Gemini API | AI post generation |
| Puppeteer | Web scraping for activity data |
| Cloudinary | Image hosting & management |
| node-cron | Scheduled job runner |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React/Vite)                 │
│   Dashboard → Post Preview → Approve/Edit → Publish     │
└──────────────────────┬──────────────────────────────────┘
                       │ Axios (REST)
┌──────────────────────▼──────────────────────────────────┐
│                  SERVER (Express.js)                    │
│                                                         │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Auth Layer │  │ Activity     │  │ Post Generator │  │
│  │ (LinkedIn  │  │ Tracker      │  │ (Gemini AI)    │  │
│  │  OAuth/JWT)│  │ (Puppeteer)  │  │                │  │
│  └────────────┘  └──────┬───────┘  └───────┬────────┘  │
│                         │                  │            │
│  ┌──────────────────────▼──────────────────▼─────────┐ │
│  │              MongoDB (Mongoose)                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │   node-cron → Every Sunday 9 PM IST             │   │
│  │   Fetch Activity → Generate Post → Publish      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    Cloudinary    LinkedIn API   GitHub/LeetCode
    (Images)      (Publishing)   (Activity Data)
```

---

## 📁 Project Structure

```
linkedin-auto-poster-complete-era/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level pages
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Axios config, helpers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/                # Passport, DB, Cloudinary setup
│   ├── controllers/           # Route handler logic
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express route definitions
│   ├── services/              # Gemini AI, Puppeteer, cron jobs
│   ├── middleware/            # Auth middleware (JWT verify)
│   ├── .env                   # Environment variables (not committed)
│   ├── app.js                 # Express app entry point
│   └── package.json
│
├── vercel.json                # Vercel deployment config
├── .gitignore
├── AGENTS.md
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key
- LinkedIn Developer App (OAuth credentials)
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/RajputSivam/linkedin-auto-poster-complete-era.git
cd linkedin-auto-poster-complete-era
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

```bash
# In server/ directory
cp .env.example .env
# Fill in the values (see Environment Variables section below)
```

### 5. Start the development servers

**Backend** (runs on `http://localhost:5000`):
```bash
cd server
npm run dev
```

**Frontend** (runs on `http://localhost:5173`):
```bash
cd client
npm run dev
```

---

## 🔐 Environment Variables

Create a `server/.env` file with the following:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/linkedin-poster

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# LinkedIn OAuth (from LinkedIn Developer App)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/auth/linkedin/callback

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## ⚡ How It Works

```
Every Sunday at 9 PM IST
         │
         ▼
  Fetch coding activity
  (GitHub commits, LeetCode/CF/CC problems solved this week)
         │
         ▼
  Send activity data to Google Gemini
  with a crafted prompt
         │
         ▼
  Gemini generates a professional LinkedIn post
         │
         ├── AUTO MODE → Publish directly via LinkedIn API
         │
         └── APPROVAL MODE → Save as draft, notify user
                              User reviews → Approve/Edit → Publish
```

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# Root vercel.json handles client routing
# Push to main branch → auto-deploys
```

Live at: **[linkedin-auto-poster-complete-era.vercel.app](https://linkedin-auto-poster-complete-era.vercel.app/)**

### Backend → Render (recommended)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env`

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a PR
```

---

## 👨‍💻 Author

**RajputSivam** — [GitHub](https://github.com/RajputSivam)

Built with ☕ and late-night commits.

---

<div align="center">
⭐ Star this repo if it helped you!
</div>
