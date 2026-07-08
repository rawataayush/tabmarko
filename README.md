# TabMarko

> AI-powered browser companion that helps users organize, search, and rediscover browser tabs and bookmarks.

Built for **NYC CodeQuest 2026**.

---

## Live Demo

Website: https://tabmarko-production.up.railway.app/

Repository: https://github.com/rawataayush/tabmarko.git

---

## Problem Statement

Users often keep dozens or even hundreds of browser tabs open because they fear losing useful information. Over time, this creates clutter, slows down productivity, and makes previously visited resources difficult to find.

Traditional bookmarks and browser tab groups require manual organization, making them inefficient for users who constantly switch between research, work, and learning.

---

## Our Solution

TabMarko automatically organizes browser tabs and bookmarks using AI.

Instead of manually managing everything, users can:

- Organize browser tabs automatically
- Search bookmarks intelligently
- Build AI-generated collections
- Rediscover previously saved resources
- Reduce browser clutter

---

# Features

### Browser Extension

- AI Tab Categorization
- AI Bookmark Organization
- Smart Bookmark Search
- Browser Tab Management

### Dashboard

- Dashboard Overview
- Tabs
- Bookmarks
- Collections
- Knowledge Base
- AI Suggestions
- Duplicate Finder
- Broken Links
- Inactive Tabs
- Notifications
- Settings

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Material Symbols Outlined (Google)

## Backend

- Supabase

## AI

- Google Gemini API

## Browser Extension

- Firefox WebExtension API

## Deployment

- Railway

---

# Project Structure

```text
tabmarko/
│
├── .vscode/                 # VS Code workspace settings
├── docs/                    # Project documentation
├── extension/               # Firefox browser extension
├── supabase/                # Supabase configuration & migrations
├── website/                 # React application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .env                     # Local environment variables (not committed)
├── .gitignore
├── package-lock.json
└── README.md
```

---

# Architecture

```text
Firefox Browser
        │
        ▼
Browser Extension
        │
        ▼
Gemini AI
        │
        ▼
Supabase
        │
        ▼
React Dashboard
```

---

# Installation

Clone the repository.

```bash
git clone https://github.com/rawataayush/tabmarko.git
```

Move into the project.

```bash
cd tabmarko
```

Move into the website.

```bash
cd website
```

Install dependencies.

```bash
npm install
```

---

# Environment Variables

Create a `.env` file inside the **website** directory.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Do **not** commit your `.env` file to GitHub.

---

# Available Scripts

Start the development server.

```bash
npm run dev
```

Build for production.

```bash
npm run build
```

Preview production build.

```bash
npm run preview
```

---

# Deployment

The frontend is deployed using **Railway**.

Deployment steps:

1. Push the latest code to GitHub.
2. Connect the repository to Railway.
3. Set the Root Directory to `website`.
4. Configure environment variables.
5. Deploy the application.

---

# Team

- **Aayush Rawat** — Frontend Development, React Dashboard, UI/UX
- **Manalp Jain** — Browser Extension, Supabase Integration, Gemini Integration

---

# Future Improvements

- Chrome Web Store Support
- Cross-device Synchronization
- Automatic Background Sync
- Workspace Sharing
- AI Research Summaries
- Advanced Semantic Search
- Productivity Analytics

---

# License

This project was built for educational and hackathon purposes.
