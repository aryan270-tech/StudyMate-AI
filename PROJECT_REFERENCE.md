# StudyMate AI — Complete Project File Reference
# Every file needed to run this project, in order.
# ============================================================


# ╔══════════════════════════════════════════════════════════════╗
# ║  FOLDER STRUCTURE                                            ║
# ╚══════════════════════════════════════════════════════════════╝
#
# studymate-ai/
# ├── index.html
# ├── package.json
# ├── vite.config.js
# ├── tailwind.config.js
# ├── postcss.config.js
# ├── .env.example
# ├── README.md
# ├── public/
# │   └── favicon.svg
# └── src/
#     ├── main.jsx
#     ├── App.jsx
#     ├── index.css
#     ├── components/
#     │   ├── Layout/
#     │   │   ├── Navbar.jsx
#     │   │   ├── AppLayout.jsx
#     │   │   └── ProtectedRoute.jsx
#     │   ├── UI/
#     │   │   ├── Spinner.jsx
#     │   │   └── Toast.jsx
#     │   ├── Dashboard/
#     │   │   ├── StatCard.jsx
#     │   │   └── AITipCard.jsx
#     │   ├── TaskCard/
#     │   │   ├── TaskCard.jsx
#     │   │   └── TaskForm.jsx
#     │   ├── StudySession/
#     │   │   ├── StudySessionCard.jsx
#     │   │   └── SessionForm.jsx
#     │   └── ProgressChart/
#     │       ├── WeeklyChart.jsx
#     │       └── SubjectChart.jsx
#     ├── pages/
#     │   ├── Landing.jsx
#     │   ├── Login.jsx
#     │   ├── Signup.jsx
#     │   ├── Dashboard.jsx
#     │   ├── Tasks.jsx
#     │   ├── Planner.jsx
#     │   └── Progress.jsx
#     ├── context/
#     │   └── AppContext.jsx
#     ├── hooks/
#     │   ├── useAuth.js
#     │   ├── useTasks.js
#     │   └── useStudySessions.js
#     ├── services/
#     │   ├── firebase.js
#     │   ├── authService.js
#     │   ├── taskService.js
#     │   └── sessionService.js
#     └── utils/
#         ├── aiRecommendations.js
#         └── dateHelpers.js


# ╔══════════════════════════════════════════════════════════════╗
# ║  SETUP & RUN INSTRUCTIONS                                    ║
# ╚══════════════════════════════════════════════════════════════╝
#
# STEP 1 — Create the project scaffold
#   npm create vite@latest studymate-ai -- --template react
#   cd studymate-ai
#
# STEP 2 — Install dependencies
#   npm install firebase lucide-react react-router-dom recharts
#   npm install -D tailwindcss postcss autoprefixer
#   npx tailwindcss init -p
#
# STEP 3 — Copy all files from this document into the project
#   (Replace the generated boilerplate files with these ones)
#
# STEP 4 — Firebase setup
#   a) Go to https://console.firebase.google.com/
#   b) Create project → Enable Email/Password Auth
#   c) Create Firestore database (production mode)
#   d) Add Firestore security rules (see README.md)
#   e) Get your web app config from Project Settings
#
# STEP 5 — Environment variables
#   cp .env.example .env
#   # Fill in your Firebase config values
#
# STEP 6 — Run locally
#   npm run dev
#   # Open http://localhost:5173
#
# STEP 7 — Build for production
#   npm run build
#
# ─── DEPLOY TO VERCEL ────────────────────────────────────────────
#   npm i -g vercel
#   vercel
#   # Add all VITE_FIREBASE_* env vars in Vercel dashboard
#   # Settings → Environment Variables
#
# ─── DEPLOY TO NETLIFY ───────────────────────────────────────────
#   npm run build
#   # Go to netlify.com → New site → drag & drop the dist/ folder
#   # OR: npm i -g netlify-cli && netlify deploy --prod --dir=dist
#   # Add env vars in Site settings → Environment variables


# ╔══════════════════════════════════════════════════════════════╗
# ║  FIRESTORE SECURITY RULES                                    ║
# ║  (Paste into Firebase Console → Firestore → Rules)          ║
# ╚══════════════════════════════════════════════════════════════╝
#
# rules_version = '2';
# service cloud.firestore {
#   match /databases/{database}/documents {
#     match /users/{userId}/{document=**} {
#       allow read, write: if request.auth != null
#                          && request.auth.uid == userId;
#     }
#   }
# }


# ╔══════════════════════════════════════════════════════════════╗
# ║  EVALUATION RUBRIC MAPPING                                   ║
# ╚══════════════════════════════════════════════════════════════╝
#
# Problem Statement & Idea (15pts)
#   → Real problem: students lack centralized, AI-aware study tools
#   → Clear user: university/school students with multiple subjects
#   → Non-trivial: AI scheduling engine + analytics + Firebase sync
#
# React Fundamentals (20pts)
#   → Functional components throughout (zero class components)
#   → useState: forms, modals, filters, loading states
#   → useEffect: Firebase auth listener, Firestore subscriptions
#   → useContext: AppContext provides global auth + data
#   → Conditional rendering: loading states, empty states, auth gates
#   → Lists & Keys: task lists, session lists, chart data
#
# Advanced React (15pts)
#   → useMemo: stats computation, filtered task lists, AI tips
#   → useCallback: event handlers in useTasks, useStudySessions
#   → useReducer: AppContext state management
#   → React.lazy + Suspense: all 7 pages are code-split
#   → Custom hooks: useAuth, useTasks, useStudySessions
#
# Backend Integration (15pts)
#   → Firebase Authentication: signUp, logIn, logOut
#   → Protected Routes: ProtectedRoute component
#   → Firestore CRUD: tasks collection, sessions collection
#   → Real-time listeners: onSnapshot for live updates
#   → Persistent user data: scoped under /users/{uid}/
#
# UI/UX (10pts)
#   → Tailwind CSS design system with custom theme tokens
#   → Fully responsive: mobile bottom nav, desktop sidebar
#   → Loading states: Spinner, disabled buttons, auth loading
#   → Error handling: Toast notification, form-level errors
#   → Clean dark theme: ink palette + acid green accent
#
# Code Quality (10pts)
#   → /components /pages /hooks /context /services /utils structure
#   → Separation of concerns: UI, logic, services are distinct
#   → Reusable components: StatCard, TaskCard, StudySessionCard
#   → Memoization prevents unnecessary re-renders
#   → Consistent naming, clean imports, no dead code
#
# Functionality (10pts)
#   → Auth system: sign up, log in, log out
#   → Dashboard: stats, AI tips, upcoming tasks, today's sessions
#   → Tasks: full CRUD, filters, search, sort, priority
#   → Planner: AI schedule generation, manual sessions, mark done
#   → Progress: weekly chart, subject breakdown, streak, log
#
# Demo & Explanation (5pts)
#   → Architecture: Context → Hooks → Services → Firebase
#   → AI engine: generateStudyPlan distributes sessions by deadline
#   → Performance: lazy loading + memoization demonstrated


# ╔══════════════════════════════════════════════════════════════╗
# ║  VIVA PREP — KEY QUESTIONS & ANSWERS                         ║
# ╚══════════════════════════════════════════════════════════════╝
#
# Q: Why useReducer in AppContext instead of multiple useState?
# A: Multiple related pieces of state (user, tasks, sessions, error)
#    update in coordinated ways. useReducer gives a single,
#    predictable state transition function, easier to reason about
#    and test than scattered useState calls.
#
# Q: Why useMemo for stats?
# A: computeStats loops through all tasks and sessions. Without
#    memoization it would re-run on every render, even if tasks
#    and sessions haven't changed. useMemo only recomputes when
#    those arrays actually change.
#
# Q: How does the AI planner work?
# A: generateStudyPlan() in aiRecommendations.js:
#    1. Filters tasks that have deadlines and aren't complete
#    2. Sorts by days until deadline (most urgent first)
#    3. For each task, calculates how many sessions fit before deadline
#    4. Spreads sessions evenly across available days
#    5. Uses task.effort (hours) to size each session's duration
#
# Q: Why onSnapshot instead of getDocs?
# A: onSnapshot creates a real-time listener. When any other device
#    or browser session updates the data, the UI updates instantly
#    without a page refresh. getDocs would only fetch once.
#
# Q: How are routes protected?
# A: ProtectedRoute reads user from AppContext (set by Firebase
#    onAuthStateChanged listener). If no user, it renders
#    <Navigate to="/login" />. During the initial auth check it
#    shows a loading spinner (authLoading state).
#
# Q: What is code splitting / React.lazy?
# A: Each page is wrapped in lazy(). The JS bundle for that page
#    is only downloaded when the user navigates to it, not upfront.
#    Suspense shows a fallback while the chunk loads. This makes
#    the initial load significantly faster.
#
# Q: Explain lifting state up in this project.
# A: Individual components like TaskCard don't manage task state.
#    State lives in AppContext → flows down through useTasks hook.
#    When a task is toggled in TaskCard, it calls onToggle which
#    is the toggleTask function from useTasks, which calls Firebase,
#    which triggers onSnapshot, which updates AppContext, which
#    re-renders all subscribed components. Single source of truth.
