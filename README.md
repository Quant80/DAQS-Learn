# DAQS Learn

AI-powered cloud learning platform built for South African learners and educators.

**Live URL:** https://learn.daqstech.com *(coming soon)*
**Part of:** N³ SmartSolutions — a DAQS product

---

## What is DAQS Learn?

DAQS Learn combines cloud notebooks, a browser IDE, AI tutoring, live classrooms, and smart assessments in a single platform — designed to make quality technical education accessible across Africa.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python 3.12) |
| Database | PostgreSQL 16 + Redis 7 |
| Auth | Firebase Authentication |
| AI Tutor | Claude API (Anthropic) |
| Notebooks | JupyterHub *(Phase 5)* |
| Browser IDE | code-server (VS Code) *(Phase 6)* |
| File Storage | Cloudflare R2 *(Phase 4)* |
| Live Classroom | LiveKit *(Phase 11)* |
| Whiteboard | tldraw *(Phase 12)* |
| Containers | Docker + Docker Compose |
| Reverse Proxy | Nginx *(production)* |

---

## User Roles

- **Student** — access notebooks, studio, AI tutor, assessments, live classes
- **Lecturer** — create courses, assignments, host live sessions
- **Admin** — platform management, user management, analytics
- **Company** — corporate training management
- **Parent** — monitor student progress

---

## Project Structure

```
DAQSLearn/
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── auth/
│   │   │   │   ├── login/      # Sign in page
│   │   │   │   └── register/   # Sign up page (role selection)
│   │   │   └── dashboard/      # User dashboard
│   │   ├── lib/
│   │   │   ├── firebase.ts     # Firebase client setup
│   │   │   └── api.ts          # API client (fetch wrapper)
│   │   └── store/
│   │       └── auth.ts         # Zustand auth state
│   └── Dockerfile
│
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── main.py             # App entrypoint + CORS
│   │   ├── api/v1/
│   │   │   ├── router.py       # Route aggregation
│   │   │   └── endpoints/
│   │   │       ├── auth.py     # Firebase token exchange
│   │   │       ├── users.py    # User profile
│   │   │       └── health.py   # Health check
│   │   ├── core/
│   │   │   └── config.py       # Settings (pydantic-settings)
│   │   ├── db/
│   │   │   └── session.py      # Async SQLAlchemy engine
│   │   ├── models/
│   │   │   └── user.py         # User ORM model
│   │   ├── schemas/
│   │   │   ├── auth.py         # Request/response schemas
│   │   │   └── user.py
│   │   └── services/
│   │       └── auth_service.py # Firebase verify + JWT issue
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
└── docker-compose.yml      # Full local dev stack
```

---

## Local Development

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/)
- [Python 3.12+](https://www.python.org/)

### 1. Clone the repo

```bash
git clone https://github.com/Quant80/DAQS-Learn.git
cd DAQS-Learn
```

### 2. Set up environment files

**Frontend:**
```bash
cp frontend/.env.local.example frontend/.env.local
# Fill in your Firebase config keys
```

**Backend:**
```bash
cp backend/.env.example backend/.env
# Fill in Firebase service account + JWT secret
```

### 3. Start with Docker (recommended)

```bash
docker-compose up --build
```

This starts:
- PostgreSQL on port `5432`
- Redis on port `6379`
- FastAPI on port `8000`
- Next.js on port `3000`

### 4. Or run services individually

**Backend:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

---

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `CLAUDE_API_KEY` | Anthropic Claude API key |
| `CLOUDFLARE_R2_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_R2_ACCESS_KEY` | R2 access key |
| `CLOUDFLARE_R2_SECRET_KEY` | R2 secret key |
| `JWT_SECRET` | Secret for signing JWTs |

---

## Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Project Foundation | ✅ Done |
| 2 | Authentication + Roles | ✅ Done |
| 3 | User Dashboards | ✅ Done |
| 4 | File Storage (Cloudflare R2) | ⏳ Planned |
| 5 | DAQS Notebook (JupyterLab) | ✅ Done |
| 6 | DAQS Studio (code-server) | ✅ Done |
| 7 | Docker Labs | ✅ Done |
| 8 | AI Tutor (Claude) | ✅ Done |
| 9 | Assessment Engine | ✅ Done |
| 10 | Course Management (LMS) | ⏳ Planned |
| 11 | Live Classroom (LiveKit) | ⏳ Planned |
| 12 | Interactive Whiteboard (tldraw) | ⏳ Planned |
| 13 | Learning Intelligence Engine | ✅ Done |
| 14 | Payments (PayFast + Stripe + Ozow) | ⏳ Planned |
| 15 | Certificates | ⏳ Planned |
| 16 | Consulting Portal | ⏳ Planned |

---

## API Reference

Base URL: `http://localhost:8000/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check + DB status |
| `POST` | `/auth/firebase` | Exchange Firebase ID token for JWT |
| `GET` | `/users/me` | Get current user profile |

Interactive docs: http://localhost:8000/docs

---

## Deployment

DAQS Learn is designed to run on a Linux VPS (DigitalOcean, AWS EC2, or Hetzner).
Production deployment guide coming with Phase 3.

Target subdomain: `learn.daqstech.com`

---

## Contributing

This is a private DAQS product. For access or queries contact:
- **Trymore Ncube** — Ncube.T@daqstech.com
- **Albert Ncube** — Ncube.A@daqstech.com

---

*Built by DAQS — Digital Assessment & Query System*
