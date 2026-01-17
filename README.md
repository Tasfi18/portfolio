# Software Engineer Portfolio

A modern, full-stack portfolio webapp built with React, TypeScript, Express, and Supabase.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Express.js** with TypeScript
- **CORS** middleware
- **Helmet** for security headers

### Database & Auth
- **Supabase** (PostgreSQL)
- **Supabase Auth** for authentication
- **Row Level Security** for data protection

## 📁 Project Structure

```
portfolio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── sections/     # Page sections (Hero, About, etc.)
│   │   │   ├── admin/        # Admin dashboard components
│   │   │   └── layout/       # Layout components (Navbar, Footer)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities (supabase client, etc.)
│   │   ├── types/            # TypeScript interfaces
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Page components
│   │   └── styles/           # Global styles
│   └── ...config files
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── index.ts          # Entry point
│   └── ...config files
└── supabase/
    └── schema.sql            # Database schema
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Email Auth in Authentication > Providers
4. Create your admin user in Authentication > Users

### 3. Environment Variables

**Frontend (.env)**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
```

**Backend (.env)**
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
```

### 4. Run Development Servers

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Admin Dashboard: http://localhost:5173/admin

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
cd frontend
vercel
```

### Backend (Railway)
1. Push code to GitHub
2. Connect repo to Railway
3. Set environment variables
4. Deploy

## 📝 License

MIT License
