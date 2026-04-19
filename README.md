# 🎓 StudyMate AI — Smart Student Companion

> An AI-powered productivity platform for students — combining intelligent study planning, task management, and progress analytics into one cohesive tool.

---

## 🌟 Problem Statement

Students today juggle multiple courses, deadlines, and study sessions with no centralized system. Traditional planners don't adapt. Generic to-do apps don't understand academic context. **StudyMate AI** solves this by offering:

- **Smart scheduling** that builds personalized study plans around your deadlines
- **AI-driven recommendations** based on your progress patterns
- **Visual progress tracking** to keep motivation high
- **Deadline-aware task management** with priority scoring

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Email/password login & signup via Firebase Auth |
| 📊 Dashboard | Personalized overview of tasks, streak, and AI tips |
| 📅 Study Planner | AI generates weekly study sessions around deadlines |
| ✅ Task Manager | Full CRUD for assignments with priority & subject tags |
| 📈 Progress Tracker | Visual charts of study hours, completion rates, streaks |
| 🤖 AI Recommendations | Contextual study tips based on upcoming deadlines |
| 🌙 Responsive UI | Mobile-first, works across all screen sizes |

---

## 🛠 Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS
- **State**: React Context API + useReducer
- **Backend**: Firebase (Auth + Firestore)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Performance**: useMemo, useCallback, React.lazy + Suspense

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- A Firebase project

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g., `studymate-ai`)
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Create a **Firestore Database** in production mode
5. Add these Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Go to Project Settings → Your apps → Add web app
7. Copy the config object

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/studymate-ai.git
cd studymate-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📦 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
# Follow prompts, add environment variables in Vercel dashboard
```

### Netlify

```bash
npm run build
# Drag the `dist` folder to Netlify dashboard
# Or: netlify deploy --prod --dir=dist
```

---

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout/
│   ├── TaskCard/
│   ├── StudySession/
│   └── ProgressChart/
├── pages/              # Route-level pages
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Planner.jsx
│   ├── Tasks.jsx
│   └── Progress.jsx
├── context/            # Global state
│   └── AppContext.jsx
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useTasks.js
│   └── useStudySessions.js
├── services/           # Firebase & API
│   ├── firebase.js
│   ├── authService.js
│   ├── taskService.js
│   └── sessionService.js
└── utils/              # Helpers
    ├── aiRecommendations.js
    └── dateHelpers.js
```

---

## 🧠 AI Recommendation Logic

The AI engine (`aiRecommendations.js`) analyzes:
- Days until each deadline
- Estimated effort per subject
- Your historical completion rate
- Current streak

It generates optimized study blocks distributed across available days, with difficulty weighting and buffer time before deadlines.

---

## 📄 License

MIT — feel free to fork and build upon this.
