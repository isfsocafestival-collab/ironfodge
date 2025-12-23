# Ironforge Waitlist Landing Page - Complete Design & Implementation Plan

## Project Structure

```
ironforgelanding/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── FounderVideo.tsx
│   │   ├── Philosophy.tsx
│   │   ├── WaitlistBenefits.tsx
│   │   ├── WaitlistForm.tsx
│   │   ├── Footer.tsx
│   │   └── MagneticButton.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── animations.ts
│   └── hooks/
│       ├── useScrollAnimation.ts
│       └── useMagneticHover.ts
└── DESIGN_SPEC.md (this comprehensive document)
```

## Color Theme

**Primary Palette:**

- **Background Dark**: `#0A0A0A` (near-black, not pure black)
- **Background Secondary**: `#111111` (subtle elevation)
- **Text Primary**: `#F5F5F5` (soft white, not harsh)
- **Text Secondary**: `#A0A0A0` (muted gray for body text)
- **Accent**: `#C9A961` (refined gold/bronze - forged metal)
- **Accent Hover**: `#D4B877` (lighter gold on interaction)
- **Border/Divider**: `#1A1A1A` (subtle separation)

**Semantic Colors:**

- **Success**: `#4A7C59` (muted green, not bright)
- **Error**: `#8B4A4A` (muted red)

**Typography Scale:**

- Hero Headline: `clamp(3rem, 8vw, 6rem)` - Extra bold, tracking tight
- Section Headings: `clamp(2rem, 5vw, 3.5rem)` - Bold
- Body Large: `1.125rem` (18px) - Line height: 1.8
- Body: `1rem` (16px) - Line height: 1.75
- Small: `0.875rem` (14px)

## Section 1: Hero Section

**Layout:**

- Full viewport height (100vh)
- Centered content vertically and horizontally
- Dark background with subtle texture/noise overlay (2-3% opacity)
- Minimal navigation (optional: small logo top-left)

**Copy:**

- **Headline**: "Strength forged in discipline. Built for longevity."
- **Subheadline**: None - let the headline breathe
- **CTA Button**: "Join the Ironforge Waitlist"

**Animation:**

- Headline: Fade in from opacity 0, translateY(30px) → 0 over 1.2s with ease-out
- CTA: Staggered entrance 0.3s after headline, scale from 0.95 → 1.0
- Background: Subtle parallax on scroll (GSAP ScrollTrigger)
- Magnetic hover effect on CTA (GSAP)

**Component**: `Hero.tsx`

## Section 2: Founder Video Section

**Layout:**

- Full-width container, max-width 1200px centered
- Video aspect ratio: 16:9 or 4:3 (cinematic)
- Soft vignette overlay (dark edges, 20% opacity)
- Padding: 8rem top/bottom, 2rem sides

**Video Requirements:**

- Embedded via iframe or video element
- Custom play button overlay (not default browser controls)
- Play interaction: Button fades out, video fades in
- Subtle zoom on play (scale 1.0 → 1.02 over 0.5s)

**Copy (if needed above video):**

- **Heading**: "Why Ironforge Exists"
- **Subheading**: None - let video speak

**Animation:**

- Section fades in on scroll (Framer Motion scroll-triggered)
- Video container: Subtle scale animation on mount
- Play button: Magnetic hover effect

**Component**: `FounderVideo.tsx`

## Section 3: Philosophy Section

**Layout:**

- Max-width: 800px centered (reading width)
- Generous padding: 10rem top/bottom, 2rem sides
- Long-form content, meant to be read slowly

**Content Structure:**

### Subsection 1: "Strength as a System"

- **Heading**: "This is not a 12-week program."
- **Body**: 3-4 paragraphs about lifelong strength, not quick fixes, building foundations that last decades.

### Subsection 2: "Core as Foundation"

- **Heading**: "All power flows from the center."
- **Body**: Core strength as the foundation, not an afterthought. Why it matters for everything else.

### Subsection 3: "Discipline Over Motivation"

- **Heading**: "Motivation fades. Discipline remains."
- **Body**: The difference between feeling like training and training regardless. Systems over feelings.

### Subsection 4: "Precision Over Chaos"

- **Heading**: "Every rep matters. Every movement intentional."
- **Body**: Quality over quantity. Form over ego. The path to mastery.

**Typography:**

- Headings: Large, bold, ample spacing above (4rem)
- Body: Generous line-height (1.8), comfortable reading
- Each subsection: 6rem spacing between

**Animation:**

- Each subsection fades in on scroll (staggered)
- Text reveals word-by-word on scroll (GSAP SplitText or similar)
- Subtle parallax on background elements

**Component**: `Philosophy.tsx`

## Section 4: Waitlist Benefits

**Layout:**

- Max-width: 900px centered
- Grid: 2 columns on desktop, 1 on mobile
- Each benefit: Card with subtle border, padding 3rem
- Spacing: 2rem between cards

**Benefits (appear on scroll):**

1. **Early Access**

   - **Title**: "Founding Member Access"
   - **Description**: "Be among the first to experience Ironforge programs before public launch."

2. **Exclusive Pricing**

   - **Title**: "Founding Member Pricing"
   - **Description**: "Lock in lifetime pricing reserved for those who join early."

3. **Direct Philosophy**

   - **Title**: "Philosophy First"
   - **Description**: "Access to the core principles and methodology before the noise of marketing."

4. **Private Community**

   - **Title**: "Founding Circle"
   - **Description**: "Join a private space for serious practitioners committed to the long game."

**Design:**

- Minimal cards: Border only, no background fill
- Icon or number (1-4) subtle, refined
- Hover: Subtle border color shift, slight scale (1.0 → 1.02)

**Animation:**

- Cards fade in sequentially on scroll (staggered 0.2s)
- Each card: Fade + translateY(20px) → 0

**Component**: `WaitlistBenefits.tsx`

## Section 5: Second CTA

**Layout:**

- Centered, max-width: 600px
- Padding: 8rem top/bottom

**Copy:**

- **Heading**: "This is not for everyone."
- **Subheading**: "But if this resonates, join us."
- **Form**: Name, Email, Submit button

**Form Design:**

- Minimal inputs: Bottom border only, no background
- Focus state: Border color shifts to accent gold
- Submit button: Same style as primary CTA
- Success state: Subtle message, form fades out
- Error state: Muted red, minimal

**Animation:**

- Section fades in on scroll
- Form inputs: Staggered fade-in
- Submit: Loading state with subtle spinner
- Success: Confetti or subtle celebration (not gimmicky)

**Component**: `WaitlistForm.tsx`

## Section 6: Footer

**Layout:**

- Minimal, centered
- Padding: 4rem top/bottom

**Content:**

- Ironforge brand mark/logo (small)
- One line: "Strength. Discipline. Longevity."
- Optional: Copyright year

**Design:**

- Subtle border-top (1px, muted)
- Text: Small, muted color

**Component**: `Footer.tsx`

## Technical Implementation

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.0",
    "@supabase/supabase-js": "^2.57.4"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

### Animation Strategy

**Framer Motion:**

- Component-level animations (fade-ins, scale)
- Scroll-triggered reveals using `useInView`
- Page transitions
- Form interactions

**GSAP:**

- Complex scroll animations (parallax)
- Text reveals (SplitText)
- Magnetic hover effects
- ScrollTrigger for advanced scroll-based animations
- Performance-critical animations

### Performance Optimizations

- Lazy load video
- Image optimization (if any)
- Code splitting for heavy components
- Debounced scroll handlers
- Will-change CSS for animated elements
- GPU-accelerated transforms

### Supabase Setup

**Table Schema:**

```sql
CREATE TABLE waitlist_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'landing_page'
);
```

**RLS Policy:**

- Public insert allowed
- No read access (admin only)

## Component Architecture

### Core Components

1. **Hero.tsx**: Hero section with headline and primary CTA
2. **FounderVideo.tsx**: Video player with custom controls
3. **Philosophy.tsx**: Long-form philosophy content sections
4. **WaitlistBenefits.tsx**: Grid of benefit cards
5. **WaitlistForm.tsx**: Form with validation and submission
6. **Footer.tsx**: Minimal footer
7. **MagneticButton.tsx**: Reusable button with magnetic hover

### Custom Hooks

1. **useScrollAnimation.ts**: Hook for scroll-triggered animations
2. **useMagneticHover.ts**: Hook for magnetic button effect

### Animation Utilities

**animations.ts**: Shared animation variants and configurations for Framer Motion

## Copy Guidelines

**Tone:**

- Confident, not arrogant
- Calm, not aggressive
- Direct, not vague
- Serious, not somber

**Voice:**

- Second person ("you") used sparingly
- First person plural ("we") for community
- Active voice
- Short sentences. Long sentences when they need to breathe.

**Avoid:**

- "Transform your life"
- "Get shredded"
- "Join thousands"
- Emojis
- Exclamation points (except rare emphasis)
- Urgency language ("Limited time", "Act now")

## Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Considerations:**

- Reduced padding (4rem → 2rem)
- Single column layouts
- Smaller typography scale
- Touch-friendly CTAs (min 44px height)
- Simplified animations (reduce parallax)

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Focus states visible
- Color contrast ratios (WCAG AA minimum)
- Screen reader friendly
- Reduced motion respect (prefers-reduced-motion)

## Launch Checklist

- [ ] All animations smooth (60fps)
- [ ] Mobile responsive tested
- [ ] Form validation working
- [ ] Supabase integration tested
- [ ] Video loads and plays correctly
- [ ] All copy reviewed
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] SEO meta tags
- [ ] Analytics setup (if needed)




