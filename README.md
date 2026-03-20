# Employment Survey System

**National Statistics Office of Georgia — Geostat**

A web-based data collection platform for employment statistics and vacancy reporting, used by organizations to submit annual HR data to the National Statistics Office.

---

## Features

### Multi-Step Survey Wizard (5 Steps)

| Step | Title | Description |
|------|-------|-------------|
| 1 | HR Data | Employee headcount for 2024/2025, education breakdown (secondary / vocational / higher), upcoming retirements |
| 2 | Vacancies | Total, announced, and unfilled vacancies; employment duration breakdown (under 6 months / 6–12 months / 1+ year) |
| 3 | Growth Plans | Planned employment growth over 1-year and 5-year horizons, by profession category |
| 4 | Reduction Plans | Planned employment reduction over 1-year and 5-year horizons, by profession category |
| 5 | Review | Final review of all entries before submission |

### Validation System (Zod)

- **Cross-field validation** — education level totals are checked against the 2025 headcount
- **Hierarchy checks** — vacancy logic enforced: `total ≥ announced ≥ unfilled`
- **Sum checks** — vacancy duration breakdown must equal the announced vacancy count
- **Duplicate detection** — the same profession category cannot appear twice in any step
- **Georgian error messages** — custom `georgianErrorMap` applied globally to Zod

### Classifier System

- Profession categories are fetched from the server once and cached
- **Two-layer caching** — in-memory `Map` (instant) + `localStorage` (TTL: 24 h)
- **Request deduplication** — concurrent identical requests share a single `Promise`
- **Prefetch strategy** — critical classifiers load on mount; secondary classifiers load after a configurable delay
- `useClassifier` / `useClassifiers` / `useClassifierValue` hooks

### Authentication

- JWT token stored in `localStorage` with expiry metadata
- **Proactive refresh** — background token renewal 5 minutes before expiry, checked every 30 seconds
- **Reactive logout** — any 401 response triggers token removal and redirect to `/login`
- **Periodic validation** — token validity checked every minute inside `AuthContext`
- `auth:logout` custom event — decoupled communication between `ApiClient` and `AuthContext`

### Notification System

- Global Zustand store — callable from anywhere, including outside the React tree
- `showNotification(message, type, duration)` — single notification
- `showNotifications(messages[])` — multiple notifications at once (used for validation error lists)
- Dismissed after 5 seconds (configurable), manual dismiss supported

### Searchable Select Component

- `SearchableSelect` — standalone, works with any data
- `RHFSearchableSelect` — React Hook Form controller wrapper
- `RHFClassifierSelect` — directly wired to the classifier store; no manual data fetching needed
- Live filtering, custom `valueField`, keyboard navigation

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| UI Framework | React | 19 |
| Language | TypeScript | ~5.9 |
| Build Tool | Vite | 7 |
| Routing | React Router | 7 |
| Forms | React Hook Form | 7 |
| Validation | Zod | — |
| State Management | Zustand | 5 |
| HTTP Client | Axios | 1 |
| Auth | JWT (jwt-decode) | 4 |
| Container | Docker + Nginx | 1.27-alpine |
| Runtime | Node.js | 22-alpine |

---

## Architecture

```
src/
├── app/
│   └── App.tsx                    # BrowserRouter, AuthProvider, lazy-loaded routes
│
├── features/
│   ├── auth/                      # Authentication feature
│   │   ├── api/                   # authApi — login, logout, getCurrentUser
│   │   ├── components/            # LoginForm, AuthLayout
│   │   ├── context/               # AuthContext + useAuth hook
│   │   ├── pages/                 # LoginPage
│   │   └── types/                 # User, LoginCredentials, AuthContextValue
│   │
│   └── survey/                    # Survey feature — core of the application
│       ├── api/                   # surveyApi — submit, patch, draft save, export
│       ├── components/
│       │   ├── steps/             # Step1–Step5 components + data entry tables
│       │   ├── navigation/        # StepIndicator, ProgressBar, StepNavigation
│       │   └── ui/                # SurveyLayout, SurveyContainer
│       ├── config/                # stepMetadata — titles and descriptions
│       ├── context/               # SurveyContext + SurveyProvider
│       ├── hooks/                 # useSurveyLoader — load existing survey from API
│       ├── pages/                 # SurveyPage, SuccessPage
│       ├── schemas/               # Zod schemas — primitives, entries, steps, validators
│       └── types/                 # SurveyFormData, HREntry, VacancyEntry, ...
│
└── shared/
    ├── api/                       # ApiClient — Axios wrapper with JWT interceptors
    ├── componets/
    │   ├── ui/                    # Button, Input, Card, Checkbox, TrueFalseRadio
    │   └── route/                 # ProtectedRoute, PublicRoute
    ├── hooks/                     # useTokenRefresh
    ├── packages/
    │   ├── classifiers/           # Classifier system
    │   │   ├── api/               # classifiersApi + Axios client (JWT auth)
    │   │   ├── cache/             # In-memory ClassifierCache with deduplication
    │   │   ├── storage/           # localStorage persistence with TTL
    │   │   ├── store/             # Zustand classifierStore
    │   │   ├── hooks/             # useClassifier, useClassifiers, useClassifierValue
    │   │   └── provider/          # ClassifierProvider — prefetch on mount
    │   ├── notifications/         # Toast notification system — Zustand store + UI
    │   └── SearchableSelect/      # Searchable dropdown components
    └── utils/                     # tokenUtils — save, validate, getTimeUntilExpiry
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Set VITE_API_URL in .env

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

### Available Scripts

```bash
npm run dev            # Development server — localhost:5173
npm run build          # Production build
npm run build:prod     # Production build (production mode)
npm run build:analyze  # Build + open bundle size visualizer
npm run preview        # Preview the production build locally
npm run type-check     # TypeScript type checking (no emit)
npm run lint           # ESLint
```

---

## Docker

### Development (with live reload)

```bash
# Standard
docker compose up

# With file-watch sync (Docker Compose Watch)
docker compose watch
```

> `src/` changes are synced into the container. `package.json` changes trigger a full rebuild.

### Production

```bash
# Set required variables in .env
VITE_API_URL=https://your-backend/api
DEPLOY_HOST_PORT=5175

docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Deploy Scripts (PowerShell)

```powershell
# Interactive menu
.\scripts\deploy.ps1

# Direct — pick a mode
.\scripts\deploy.ps1 local    # Docker build locally, run container
.\scripts\deploy.ps1 dist     # npm build locally → upload dist/ → server nginx
.\scripts\deploy.ps1 remote   # Upload source → Docker build on server
.\scripts\deploy.ps1 sync     # Quick: rebuild dist/ + sync to server (no restart)

# Container management
.\scripts\manage.ps1 status   # Show status — local + remote
.\scripts\manage.ps1 logs     # Tail live container logs (Ctrl+C to exit)
.\scripts\manage.ps1 restart  # Restart container on server
.\scripts\manage.ps1 undeploy # Stop + remove container (image and files kept)
.\scripts\manage.ps1 delete   # Full cleanup — container + image + server files
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL (include `/api` suffix) | `https://survey-moesdapi.geostat.ge/api` |
| `VITE_APP_TITLE` | Browser tab title | `GeoStat Survey` |
| `DEPLOY_SERVER` | SSH target for remote deployments | `user@192.168.1.10` |
| `DEPLOY_HOST_PORT` | Host port mapped to the container | `5175` |
| `DEPLOY_PATH` | Base deployment directory on the server | `/home/user/apps` |

**File priority** (highest to lowest): `.env.local` → `.env.development` / `.env.production` → `.env`

---

## API Reference

Backend: **Spring Boot REST API** — `survey-moesdapi.geostat.ge`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate and receive JWT token |
| `GET` | `/auth/me` | Get current authenticated user |
| `POST` | `/auth/logout` | Invalidate session |
| `GET` | `/surveys/user/{id}` | Load existing survey for a user |
| `POST` | `/surveys` | Submit completed survey |
| `PUT` | `/surveys/{id}` | Replace survey data |
| `PATCH` | `/surveys/{id}` | Partial survey update |
| `POST` | `/surveys/draft` | Save draft |
| `GET` | `/surveys/{id}/export` | Export survey (pdf / excel / json) |
| `GET` | `/api/v1/classifiers/professions` | Fetch profession category list |

---

## Build Optimization

Manual chunk splitting for optimal lazy loading:

```
vendor-react-core   →  assets/js/vendor/
vendor-react-dom    →  assets/js/vendor/
vendor-router       →  assets/js/vendor/
vendor-rhf          →  assets/js/vendor/
vendor-zod          →  assets/js/vendor/
pkg-classifiers     →  assets/js/packages/
pkg-notifications   →  assets/js/packages/
survey-step1..5     →  assets/js/survey/steps/   ← lazy loaded per step
survey-schemas      →  assets/js/survey/
feature-auth        →  assets/js/features/
shared-ui           →  assets/js/shared/
```

- Terser minification (`passes: 2`), `console.log` / `console.debug` stripped in production
- Per-step lazy loading — only the active step's code is loaded
- CSS code-split, static assets organized into `assets/images/`, `assets/fonts/`, `assets/css/`

---

## Author

**Aleksandre Sisvadze** — sisvadzeal@gmail.com

Ministry of Economy and Sustainable Development of Georgia /
National Statistics Office of Georgia (Geostat)

---

*Copyright © 2025 National Statistics Office of Georgia. All rights reserved.*