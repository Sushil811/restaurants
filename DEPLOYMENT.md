# Lumiere Restaurant — Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (free) or local MongoDB
- Stripe account (test keys)

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all

# Or install individually:
npm install --prefix frontend
npm install --prefix backend
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Start Development Servers

```bash
# From root directory - starts both frontend and backend
npm run dev

# Or separately:
npm run frontend   # Next.js on http://localhost:3000
npm run backend    # Express on http://localhost:5000
```

---

## ☁️ Production Deployment

### Frontend: Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add all environment variables from `frontend/.env.example`
5. Deploy!

**Vercel Settings:**
- Framework: Next.js
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `.next`

### Backend: Railway (Recommended)

1. Push code to GitHub
2. Connect to [Railway](https://railway.app)
3. Create new service from GitHub repo
4. Set root directory to `backend`
5. Add environment variables from `backend/.env.example`
6. Set start command: `npm start`
7. Deploy!

**Alternative: Render**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### Database: MongoDB Atlas

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Create database user with read/write access
4. Whitelist IPs (use 0.0.0.0/0 for Railway/Render)
5. Copy connection string to `MONGODB_URI` env var

### Image Storage: Cloudinary

1. Create account at [Cloudinary](https://cloudinary.com)
2. Get Cloud Name, API Key, API Secret from dashboard
3. Add to backend `.env`

---

## 🔑 Required API Keys

| Service | Purpose | Get it from |
|---|---|---|
| MongoDB Atlas | Database | mongodb.com/atlas |
| Stripe | Payments | dashboard.stripe.com |
| Cloudinary | Image storage | cloudinary.com |
| Google OAuth | Social login | console.developers.google.com |
| NextAuth Secret | Session security | `openssl rand -base64 32` |

---

## 📁 Project Structure

```
Restaurants/
├── frontend/        # Next.js 14 App (deploy to Vercel)
├── backend/         # Express.js API (deploy to Railway)
├── package.json     # Root scripts
└── DEPLOYMENT.md    # This file
```

---

## 🔧 Production Checklist

- [ ] Change all JWT secrets to strong random strings
- [ ] Use Stripe production keys (not test keys)
- [ ] Set up MongoDB Atlas with proper security
- [ ] Configure Cloudinary with upload presets
- [ ] Set up email service (SendGrid recommended for production)
- [ ] Enable MongoDB Atlas IP allowlist (restrict to backend IP)
- [ ] Set `NODE_ENV=production` in backend
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Run `npm run build` to verify no TypeScript errors
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure custom domain

---

## 🎨 Customization

### Changing the Restaurant Brand
1. Update `NEXT_PUBLIC_RESTAURANT_NAME` in `.env.local`
2. Edit colors in `frontend/tailwind.config.ts`
3. Update font in `frontend/src/app/globals.css`
4. Replace logo in `frontend/public/`

### Adding Menu Items
- Use the Admin Panel at `/admin/menu` to add/edit items
- Or seed the database using the backend API

### Stripe Setup
1. Create Stripe account
2. Get test keys from Dashboard > Developers > API Keys
3. Add webhook endpoint: `https://your-backend-url.com/api/v1/payments/webhook`
4. Enable events: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## 📊 Default Admin Access

After first launch, create an admin user:

```bash
# In MongoDB Atlas or via API:
# Set user.role = 'admin' for your account
```

Or use the signup form and then update the role in MongoDB Atlas directly.

---

## 🌐 Multi-language Support

The app supports English, Hindi, and French via `next-intl`.
Translation files are in `frontend/messages/`:
- `en.json` - English
- `hi.json` - Hindi  
- `fr.json` - French

---

## 📞 Support

For questions about this codebase, refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
