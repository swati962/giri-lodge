# Hotel Management System

A modern hotel management web application built with **Next.js 14**, **Supabase**, and **Tailwind CSS**.

## Features

- **Admin Authentication** - Secure login/signup with Supabase Auth
- **Customer Management** - Add, edit, delete, and search customers
- **Aadhar Card Upload** - Upload and store customer ID photos
- **Room Management** - Manage AC, Non-AC, and Dormitory rooms
- **Booking System** - Check-in/check-out tracking with automatic room status updates
- **Dashboard** - Overview of customers, rooms, and active bookings

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel (free tier)

---

## Setup Instructions

### 1. Create a Supabase Project (Free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** and fill in the details
3. Wait for the project to be created (~2 minutes)

### 2. Setup Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql` and run it
3. Copy the contents of `supabase/storage.sql` and run it

### 3. Get API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

### 4. Configure Environment

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 5. Install Dependencies

```bash
cd C:\repos\HotelApp
npm install
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Admin Account

1. Go to the login page
2. Click "Don't have an account? Sign up"
3. Enter your email and password (min 6 characters)
4. Check your email for confirmation link
5. Click the link to verify your account
6. Log in with your credentials

---

## Deploy to Vercel (Free)

### Method 1: Deploy with GitHub

1. Push your code to a GitHub repository:
   ```bash
   cd C:\repos\HotelApp
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/hotel-app.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click **Add New** → **Project**

4. Select your `hotel-app` repository

5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

6. Click **Deploy**

7. Your app will be live at `https://your-app.vercel.app`

### Method 2: Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd C:\repos\HotelApp
   vercel
   ```

3. Follow the prompts and add your environment variables when asked.

---

## Project Structure

```
HotelApp/
├── app/
│   ├── actions/           # Server actions for CRUD operations
│   │   ├── bookings.ts
│   │   ├── customers.ts
│   │   └── rooms.ts
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── bookings/
│   │   ├── customers/
│   │   ├── rooms/
│   │   ├── layout.tsx     # Dashboard layout with sidebar
│   │   └── page.tsx       # Dashboard home
│   ├── login/
│   │   └── page.tsx       # Login/Signup page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # Root redirect
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   └── server.ts      # Server Supabase client
│   └── types.ts           # TypeScript types
├── supabase/
│   ├── schema.sql         # Database schema
│   └── storage.sql        # Storage bucket setup
├── middleware.ts          # Auth middleware
└── ...config files
```

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `customers` | Guest information with Aadhar details |
| `rooms` | Room inventory (AC, Non-AC, Dormitory) |
| `bookings` | Check-in/check-out records |

### Room Types
- `AC` - Air-conditioned rooms
- `NON_AC` - Non-AC rooms  
- `DORMITORY` - Shared dormitory beds

### Booking Status
- `CHECKED_IN` - Guest currently staying
- `CHECKED_OUT` - Guest has left
- `CANCELLED` - Booking was cancelled

---

## Support

If you have questions or issues:
1. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
3. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

## License

MIT License - feel free to use this for your hotel!
