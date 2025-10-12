# 🚀 Setup Guide

Follow these steps to get your Workout Progression PWA running.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, Tailwind, and next-pwa.

## Step 2: Set Up Database

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
```sql
CREATE DATABASE workout_progression;
```

3. Copy environment file:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and update the connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/workout_progression"
```

### Option B: Vercel Postgres (Cloud)

1. Create a Vercel account at vercel.com
2. Create a new Postgres database in your Vercel dashboard
3. Copy the connection string
4. Create `.env.local` and paste the connection string

### Option C: Neon (Cloud - Free Tier)

1. Sign up at neon.tech
2. Create a new project
3. Copy the connection string
4. Create `.env.local` and paste the connection string

## Step 3: Initialize Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This will:
- Create all database tables
- Generate the Prisma client for type-safe queries

## Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Add Icons (Optional but Recommended)

Create PWA icons and place them in the `/public` folder:
- `icon-192x192.png` (192×192 pixels)
- `icon-512x512.png` (512×512 pixels)
- `apple-touch-icon.png` (180×180 pixels)

Use a tool like:
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/favicon-generator/

## Step 6: Test the App

1. **Add an exercise**: Click "Add Your First Exercise"
2. **Set progression**: (Feature to be implemented)
3. **Log a workout**: Go to Workouts → New
4. **Test offline**: Open DevTools → Network tab → Set to Offline

## Step 7: Deploy to Vercel (Optional)

1. Push code to GitHub
2. Import repository on Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

Vercel will automatically:
- Build your Next.js app
- Set up HTTPS
- Enable PWA features
- Deploy globally on CDN

## Troubleshooting

### Database connection error
- Verify your DATABASE_URL is correct
- Check PostgreSQL is running (if using local)
- Ensure database exists

### Prisma errors
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### PWA not working
- PWA features are disabled in development mode
- Service worker only works in production or on HTTPS
- Deploy to Vercel or use `npm run build && npm start`

### Port already in use
```bash
# Use different port
npm run dev -- -p 3001
```

## Next Steps

Now you have the skeleton running! The next phase is implementing:
1. Progression settings form
2. Recommendation algorithm integration
3. Workout tracking interface
4. Data visualization

See README.md for the full feature roadmap.
