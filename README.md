# ReSync AI

An intelligent resume tailoring and job hunting platform that uses AI to optimize your resume for specific job postings, calculate ATS scores, and streamline your job search.

## 🎯 Features

- **Resume Tailoring**: AI-powered resume customization for specific job postings
- **ATS Score Analysis**: Real-time scoring and optimization recommendations
- **Job Hunting Dashboard**: Centralized job search and application tracking
- **Skills Gap Analysis**: Identify missing skills for target positions
- **Analytics Dashboard**: Track tailoring sessions, application metrics, and success rates
- **Multi-Resume Management**: Organize and manage multiple resume versions
- **Smart Session Management**: Track all your tailoring and job hunting sessions

## 🏗️ Architecture

This is a **monorepo** containing:

```
ReSync AI/
├── apps/
│   ├── frontend/          # Next.js web application
│   └── backend/           # FastAPI REST API
├── package.json           # Root workspace config
└── vercel.json            # Deployment configuration
```

### Frontend (`apps/frontend/`)
- **Framework**: Next.js 14.2.29 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Zustand 5.0.11
- **Data Fetching**: TanStack Query (React Query) 5.71.10
- **Form Handling**: React Hook Form 7.56.0 + Zod 3.24.2 validation
- **Authentication**: Supabase JWT
- **Deployment**: Vercel

### Backend (`apps/backend/`)
- **Framework**: FastAPI 0.115.6
- **Language**: Python 3.11+
- **ORM**: SQLAlchemy 2.0.36 (async)
- **Database**: PostgreSQL 15+
- **Authentication**: Supabase JWT
- **Caching**: Redis 5.2.1 (with in-memory fallback)
- **Rate Limiting**: Redis-based with memory fallback
- **Testing**: Pytest 8.3.5 + pytest-asyncio
- **AI Integration**: Groq API
- **Async**: Asyncpg 0.30.0

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.11+ (backend)
- npm or pnpm (frontend package manager)
- PostgreSQL 15+ (database)
- Supabase account (authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/afreens/ReSync-Ai.git
   cd ReSync\ AI
   ```

2. **Install frontend dependencies**
   ```bash
   cd apps/frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   **Frontend** (`apps/frontend/.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   **Backend** (`apps/backend/.env`):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/resync_ai
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GROQ_API_KEY=your_groq_api_key
   REDIS_URL=redis://localhost:6379  # Optional
   ```

5. **Run migrations** (backend)
   ```bash
   cd apps/backend
   alembic upgrade head
   ```

## 🏃 Development

### Start Frontend Development Server
```bash
cd apps/frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Start Backend Development Server
```bash
cd apps/backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API available at [http://localhost:8000](http://localhost:8000)

### Run Tests
```bash
cd apps/backend
pytest tests/ -v
```

## 📦 Build & Deployment

### Build Frontend
```bash
cd apps/frontend
npm run build
```

### Build Backend (Docker)
```bash
cd apps/backend
docker build -t resync-ai-backend .
```

### Deploy to Vercel (Frontend)
The frontend is automatically deployed to Vercel on every push to `main`:
- **Preview**: Automatic deployment on feature branches
- **Production**: Automatic deployment on `main` branch
- **URLs**: 
  - Production: https://resyncc.vercel.app
  - Preview: Auto-generated per deployment

### Deploy Backend
Backend deployment recommended on Railway, Render, or your preferred platform. Ensure:
- PostgreSQL database is provisioned
- Redis instance is available (optional but recommended)
- Environment variables are set securely

## 📁 Project Structure

```
apps/frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── dashboard/                # Protected dashboard routes
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page
├── components/
│   ├── analytics/                # Analytics cards & charts
│   ├── dashboard/                # Dashboard UI components
│   ├── job-hunt/                 # Job hunting features
│   ├── resume/                   # Resume editor & display
│   ├── tailor/                   # Resume tailoring workflow
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── api.ts                    # API client (fetch wrapper)
│   ├── supabase.ts               # Supabase client setup
│   ├── validation.ts             # Zod validation schemas
│   └── types.ts                  # TypeScript type definitions
├── public/                       # Static assets
└── styles/                       # Global & component styles

apps/backend/
├── app/
│   ├── api/                      # API route handlers
│   ├── core/
│   │   ├── config.py             # Configuration & env vars
│   │   ├── rate_limit.py         # Rate limiting logic
│   │   └── security.py           # Security utilities
│   ├── models/                   # SQLAlchemy models
│   ├── services/                 # Business logic
│   └── main.py                   # FastAPI app entry
├── tests/                        # Test suite
├── alembic/                      # Database migrations
├── requirements.txt              # Python dependencies
└── pytest.ini                    # Pytest configuration
```

## 🔐 Authentication

- Uses **Supabase** for authentication
- JWT tokens stored securely in HTTP-only cookies
- Protected routes require valid JWT
- Row-level security (RLS) policies enforce data isolation

## 📊 Data Flow

1. User authenticates via Supabase (frontend)
2. Frontend receives JWT token
3. Token sent with API requests to backend
4. Backend validates JWT and processes requests
5. Results cached with TanStack Query (frontend)
6. Rate limiting applied per user plan (backend)

## 🛠️ Tech Stack Highlights

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend UI** | React 18 + Next.js 14 | Web framework |
| **Frontend Data** | TanStack Query | Server state management |
| **Frontend Forms** | React Hook Form + Zod | Form validation |
| **Frontend Styling** | Tailwind CSS | Utility-first CSS |
| **Frontend State** | Zustand | Client state (UI) |
| **Backend API** | FastAPI | REST API framework |
| **Backend Data** | SQLAlchemy 2.0 | ORM |
| **Backend Async** | Asyncpg | PostgreSQL driver |
| **Backend Cache** | Redis | Distributed caching |
| **Database** | PostgreSQL | Primary datastore |
| **Auth** | Supabase JWT | Authentication |
| **Deployment** | Vercel | Frontend hosting |

## 📝 Environment Variables

### Frontend
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_API_URL` - Backend API base URL

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase service role key
- `GROQ_API_KEY` - Groq API key for AI features
- `REDIS_URL` - Redis connection URL (optional)
- `ALLOWED_ORIGINS` - CORS allowed origins

## 🐛 Debugging

### Frontend
- Enable React DevTools: https://react-devtools-tutorial.vercel.app/
- Check browser console for errors
- Use Next.js debug mode: `DEBUG=* npm run dev`

### Backend
- Check FastAPI docs: http://localhost:8000/docs
- View database logs: `SQLALCHEMY_ECHO=true`
- Monitor async tasks with `asyncio` logging

## 📚 API Documentation

Interactive API docs available at:
- Development: http://localhost:8000/docs (Swagger UI)
- Development: http://localhost:8000/redoc (ReDoc)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

**Branch naming convention:**
- `feature/` - New features
- `bugfix/` - Bug fixes
- `chore/` - Maintenance
- `refactor/` - Code improvements

## 📄 License

MIT License - see LICENSE file for details

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Contact: support@resynccai.com

## 🙏 Acknowledgments

- Supabase for authentication infrastructure
- Groq for AI capabilities
- Vercel for frontend hosting
- The open-source community
