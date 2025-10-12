# Workout Progression PWA

A Progressive Web App for tracking workout exercises and calculating progressive overload. Built with Next.js 14, optimized for iOS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use Vercel Postgres/Neon)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your database connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/workout_progression"
```

3. **Set up the database:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 PWA Features

### iOS Optimization
- **Standalone mode**: Hides Safari UI when installed
- **Apple touch icons**: 180×180 icon for iOS home screen
- **Status bar styling**: Matches iOS system design
- **Safe area support**: Respects iPhone notches and home indicators

### Offline Support
- Service Worker caching (disabled in development)
- Offline fallback pages
- Asset caching for fast loading

### Installation
On iOS:
1. Open Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. App will launch in standalone mode

## 🏗 Project Structure

```
├── app/
│   ├── api/              # API routes (backend)
│   │   ├── exercises/    # Exercise CRUD operations
│   │   ├── progression/  # Progression settings & recommendations
│   │   └── workouts/     # Workout session management
│   ├── exercises/        # Exercise pages
│   ├── workouts/         # Workout pages
│   ├── layout.tsx        # Root layout with PWA meta tags
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles with iOS components
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   └── progression.ts    # Progression calculation logic
├── prisma/
│   └── schema.prisma     # Database schema
├── public/
│   ├── manifest.json     # PWA manifest
│   └── [icons]           # App icons (to be added)
└── [config files]
```

## 🗄 Database Schema

### Exercise
- Exercise name, description, category
- One-to-one with ProgressionSettings
- One-to-many with WorkoutLog

### ProgressionSettings
- Current weight, reps, sets
- Progression type (linear, exponential, percentage)
- Growth rate
- Frequency (per workout, per rotation, weekly, bi-weekly)

### WorkoutSession
- Date, notes, completion status
- One-to-many with WorkoutLog

### WorkoutLog
- Links exercise to workout session
- Actual weight, reps, sets performed
- Completion status and notes

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (iOS-themed)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **PWA**: next-pwa
- **Language**: TypeScript

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**: Import your repository
3. **Add environment variables**: Set `DATABASE_URL` in Vercel dashboard
4. **Deploy**: Automatic on every push

### Database Options
- **Vercel Postgres**: Built-in, zero-config
- **Neon**: Serverless Postgres with free tier
- **Railway**: Simple Postgres hosting

### Post-Deployment
1. Run migrations: `npx prisma migrate deploy`
2. Test PWA installation on iPhone
3. Run Lighthouse PWA audit

## 📝 Next Steps

This is the skeleton/structure. To complete the app:

1. **Add icons**: Create 192×192, 512×512, and 180×180 icons
2. **Implement exercise detail page**: Show progression settings and recommendations
3. **Implement workout creation**: Allow logging exercises with weight/reps/sets
4. **Add charts/graphs**: Visualize progression over time
5. **Implement offline sync**: Queue actions when offline
6. **Add animations**: iOS-style transitions and micro-interactions

## 🎯 Feature Roadmap

- [x] Project structure
- [x] Database schema
- [x] API routes
- [x] Basic UI pages
- [ ] Exercise progression settings form
- [ ] Workout recommendation display
- [ ] Workout logging interface
- [ ] Progress charts
- [ ] Data export/import
- [ ] Push notifications (iOS 16.4+)

## 📄 License

MIT

## 🤝 Contributing

This is a personal project template. Feel free to fork and customize for your needs!
