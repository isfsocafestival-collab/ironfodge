# Ironforge Waitlist Landing Page

A premium landing page for the Ironforge waitlist, built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and GSAP.

## Features

- **Premium Design**: Dark theme with refined gold accents, subtle animations, and elegant typography
- **Smooth Animations**: Scroll-triggered animations using Framer Motion and GSAP
- **Magnetic Hover Effects**: Interactive buttons with magnetic hover effects
- **Video Integration**: Custom video player with play button overlay
- **Waitlist Form**: Integrated Supabase backend for waitlist submissions
- **Fully Responsive**: Mobile-first design that works on all devices
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ironforgelanding
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:

Create a table in your Supabase project:

```sql
CREATE TABLE waitlist_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'landing_page'
);
```

Set up Row Level Security (RLS) policies:
- Enable RLS on the table
- Create a policy that allows public INSERT operations
- Restrict SELECT to authenticated users only (or admin)

5. Add your founder video:

Place your founder video file at `public/founder-video.mp4` or update the video source in `src/components/FounderVideo.tsx`.

6. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
ironforgelanding/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and configurations
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── DESIGN_SPEC.md      # Complete design specification
└── README.md           # This file
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette.

### Content

- **Hero Section**: Edit `src/components/Hero.tsx`
- **Philosophy Content**: Edit `src/components/Philosophy.tsx`
- **Benefits**: Edit `src/components/WaitlistBenefits.tsx`
- **Form Copy**: Edit `src/components/WaitlistForm.tsx`

### Animations

- Animation variants: `src/lib/animations.ts`
- Scroll animations: `src/hooks/useScrollAnimation.ts`
- Magnetic effects: `src/hooks/useMagneticHover.ts`

## Technologies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **GSAP**: Advanced animations and scroll effects
- **Supabase**: Backend for waitlist submissions

## License

Private project - All rights reserved




