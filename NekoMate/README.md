# NekoMate (StudyBuddy)

NekoMate is a study companion app that helps you plan, focus, and track your progress. It brings together a Focus Timer, Calendar, Tasks, Notes, and Analytics with a clean white/blue/orange theme. The app uses Firebase for Auth and Firestore data storage.

## Overview

- **Purpose**: Improve study productivity with timers, tasks, events, and insights.
- **Platforms**: Web (React + TypeScript + Vite).
- **Data**: Stored securely in Firebase (Auth + Firestore).

## Key Features

- **Authentication**: Login/Signup via Firebase Auth (`src/Pages/LoginPage.tsx`).
- **Dashboard**: Quick access to calendar, timer, tasks, and notes (`src/Pages/Dashboard.tsx`).
- **Focus Timer**: Name sessions, view last session, maintain history; syncs across pages (`src/components/Dashboard/Timer.tsx`, `src/Pages/TimerPage.tsx`).
- **Calendar**: Add/view events and tasks with Firebase-backed storage (`src/components/Dashboard/Calendar.tsx`).
- **Tasks (To‑Do)**: Create, update, and complete tasks (`src/Pages/Tasktodo.tsx`).
- **Notes**: Lightweight notes widget (`src/components/Dashboard/Notes.tsx`).
- **Analytics**: Charts showing study trends (`src/Pages/Analytics.tsx`).
- **Profile**: Manage basic user details (`src/Pages/Profile.tsx`).

## Tech Stack

- **Frontend**: `react`, `typescript`, `vite`
- **UI/Styling**: `tailwindcss`, `framer-motion`, `lucide-react`
- **Calendar/Date**: `react-day-picker`, `date-fns`
- **Charts**: `recharts`
- **Backend**: `firebase` (Auth, Firestore)

## Project Structure

```
NekoMate/
   components.json
   eslint.config.js
   index.html
   package.json
   README.md
   tsconfig*.json
   vite.config.ts
   public/
   src/
      App.css
      App.tsx
      index.css
      main.tsx
      assets/
      components/
         Dashboard/
            Calendar.tsx
            Notes.tsx
            Notifications.tsx
            SideBar.tsx
            Task.tsx
            Timer.tsx
         ui/
            button.tsx
            calendar.tsx
      config/
         firebase.ts
      lib/
         utils.ts
      Pages/
         Analytics.tsx
         ChatbotPage.tsx
         Dashboard.tsx
         LoginPage.tsx
         Profile.tsx
         Tasktodo.tsx
         TimerPage.tsx
      services/
         analyticsService.ts
         calendarService.ts
         timerService.ts
         todoService.ts
      types/
         analytics.ts
         calendar.ts
         timer.ts
         timerState.ts
         todo.ts
```

### Core Files

- `src/config/firebase.ts`: Initializes Firebase app, Auth, and Firestore instances.
- `src/App.tsx` / `src/main.tsx`: App entry and routing bootstrap.
- `src/Pages/*`: Top-level views (Dashboard, Timer, Analytics, Login, etc.).
- `src/components/Dashboard/*`: Widgets used on the dashboard.
- `src/services/*`: Data access layer for Firestore operations.
- `src/types/*`: Shared TypeScript types/interfaces.

## Setup

### Prerequisites

- Node.js 18+
- npm
- A Firebase project (Auth + Firestore enabled)

### Install Dependencies

```cmd
npm install
```

### Environment Variables

Create a `.env` file at the project root with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Ensure `src/config/firebase.ts` reads these via `import.meta.env.*`.

### Run in Development

```cmd
npm run dev
```

Open the local URL printed by Vite in your browser.

## Firebase Configuration

- **Auth**: Enable Email/Password (and any desired providers).
- **Firestore**: Create collections used by services:
   - `timerSessions`: stores session name, duration, timestamps, userId.
   - `calendarEvents`: stores event/task details with date, status, userId.
   - `todos`: stores to‑do items with completion state, userId.
- **Indexes**: The app prefers simple queries. If composite indexes are needed, manage via `firestore.indexes.json` and deploy with Firebase CLI.
- **Security Rules**: Restrict documents by `userId`. Example files may exist in repo for rules.

## Pages & Components Map

- `LoginPage.tsx`: Firebase Auth login/signup flow.
- `Dashboard.tsx`: Aggregates widgets (Timer, Calendar, Tasks, Notes, Notifications).
- `TimerPage.tsx`: Full timer experience with naming, history, last session.
- `Analytics.tsx`: Uses `analyticsService.ts` and Recharts to visualize study metrics.
- `Tasktodo.tsx`: CRUD for to‑dos via `todoService.ts`.
- `Profile.tsx`: User info and settings stub.
- `components/Dashboard/Timer.tsx`: Timer widget with debounced Firestore sync.
- `components/Dashboard/Calendar.tsx`: Add/view events; client-side date filtering to minimize index needs.
- `components/Dashboard/Task.tsx`: Dashboard tasks quick view.
- `components/Dashboard/Notes.tsx`: Simple notes widget.

## Services Overview

- `timerService.ts`: Create/read timer sessions; ensures cross-page state persistence.
- `calendarService.ts`: Create/read/update events; simplified queries (filter in JS by month/day).
- `todoService.ts`: CRUD for tasks by `userId`.
- `analyticsService.ts`: Aggregates session data for charts.

## Available Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check and build for production.
- `npm run lint`: Run ESLint.
- `npm run preview`: Preview the production build.

## Development Tips

- Keep Firestore queries simple; favor fetching by `userId` and filtering client-side.
- Use TypeScript types from `src/types/*` to avoid runtime errors.
- Styling uses Tailwind CSS; utility components live under `components/ui/*`.
- Animations via Framer Motion should be lightweight and consistent with theme.

## Deployment

If using Firebase Hosting or deploying rules/indexes:

```cmd
:: Install Firebase CLI if needed
npm install -g firebase-tools

:: Login and initialize (once)

firebase init

:: Deploy hosting, rules, and indexes
firebase deploy
```

Alternatively, deploy the static build to any static hosting:

```cmd
npm run build
```

Serve files under `dist/`.

## Troubleshooting

- **Auth errors**: Verify `.env` values and enabled providers in Firebase Console.
- **Firestore index errors**: Simplify queries or add composites via `firestore.indexes.json`.
- **Timer not syncing**: Ensure user is authenticated; check debounced updates in `timerService.ts`.
- **Calendar event not saving**: Confirm `userId` is set and rules allow write; check client-side filtering logic.

## License

Copyright © 2025. All rights reserved.
