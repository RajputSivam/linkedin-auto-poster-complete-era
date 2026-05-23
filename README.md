# LinkedIn Auto-Poster

A full-stack MERN + GenAI web application that tracks weekly coding activity, generates LinkedIn posts with Google Gemini, and publishes them automatically or after user approval.

## Project structure

- `client/` - React + Vite frontend
- `server/` - Express backend and job scheduler

## Local setup

1. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

3. Create `server/.env` with the required variables.

4. Start backend and frontend separately:
   ```bash
   cd server
   npm run dev
   ```

   ```bash
   cd client
   npm run dev
   ```

## Notes

- `client` uses React, Vite, Tailwind CSS, and Axios.
- `server` uses Express, Passport LinkedIn OAuth, JWT, MongoDB, Puppeteer, Google Gemini, Cloudinary, and node-cron.
- The automatic job runs every Sunday at 9 PM IST.
