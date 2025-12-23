# Mobile Performance & Rendering Audit - Ironforge Landing Page

## Executive Summary

This audit identifies critical performance bottlenecks affecting real mobile devices. The application renders correctly on desktop and simulated mobile views, but fails on actual mobile devices due to:

1. **Blocking video loading** in hero section
2. **Hidden H1 text** that depends on JavaScript execution
3. **Heavy animations** blocking initial render
4. **No lazy loading** strategy for below-the-fold content
5. **Hydration mismatches** from window size checks during render

---

## Root Causes Identified

### 🔴 CRITICAL: Hero Video Loading (Priority 1)

**Location:** `src/components/Hero.tsx` (lines 446-464)

**Issues:**
- Video loads immediately with `autoPlay` attribute
- No `preload="none"` or `loading="lazy"`
- No poster image fallback
- Video is inside SVG `foreignObject` which can cause layout issues on mobile
- Video attempts autoplay immediately, blocking rendering on mobile browsers
- No mobile-specific video strategy (e.g., lower quality or poster-only)

**Impact:**
- Blocks initial paint on mobile
- Consumes bandwidth before user interaction
- Can cause layout shifts when video loads
- Mobile browsers may block autoplay, causing delayed rendering

**Expected Fix:**
- Add `preload="none"` to video element
- Implement poster image as fallback
- Lazy load video (only load when in viewport or on user interaction)
- Consider mobile-specific video source (lower bitrate)
- Use `loading="lazy"` attribute

---

### 🔴 CRITICAL: H1 Text Non-Rendering (Priority 1)

**Location:** `src/components/Hero.tsx` (lines 484-507, 62-160)

**Issues:**
- H1 is hidden with `opacity: 0` and positioned absolutely (line 496)
- Text visibility depends on SVG mask positioning in `useEffect`
- SVG mask positioning uses double `requestAnimationFrame` (lines 62-63)
- On mobile, if JavaScript execution is slow, text won't render at all
- No fallback visible text for users with slow JS or disabled JS

**Impact:**
- Hero text may not appear on slow mobile devices
- Text is invisible until JavaScript executes and SVG mask is positioned
- Creates poor perceived performance
- Accessibility issue (screen readers may not read hidden text)

**Expected Fix:**
- Render visible H1 text immediately (CSS-only)
- Use SVG mask as enhancement, not requirement
- Ensure text is visible even if JavaScript fails
- Defer SVG mask positioning to after initial paint

---

### 🟠 HIGH: Heavy useEffect on Mount (Priority 2)

**Location:** `src/components/Hero.tsx` (lines 20-273)

**Issues:**
- Massive `useEffect` runs immediately on mount
- Complex SVG mask calculations (lines 42-161)
- Multiple ScrollTrigger instances created synchronously
- Spiral animations with framer-motion run immediately (lines 384-417)
- Window size checks during render (line 22) can cause hydration issues

**Impact:**
- Blocks main thread on mobile devices
- Delays initial render
- Causes janky scrolling
- Battery drain from heavy animations

**Expected Fix:**
- Split useEffect into smaller, prioritized chunks
- Defer non-critical animations until after first paint
- Use `requestIdleCallback` for decorative animations
- Move window size checks to `useLayoutEffect` or use CSS media queries

---

### 🟠 HIGH: Spiral Animations Blocking Render (Priority 2)

**Location:** `src/components/Hero.tsx` (lines 356-419), `src/components/FounderVideo.tsx` (lines 228-397), `src/components/Philosophy.tsx` (lines 188-251)

**Issues:**
- Multiple framer-motion path animations with complex transitions
- Animations start immediately on mount
- No deferral for mobile devices
- Multiple SVG paths with filters and gradients

**Impact:**
- Blocks initial paint
- Consumes GPU resources unnecessarily
- Can cause frame drops on mobile
- Battery drain

**Expected Fix:**
- Defer spiral animations until after hero content is painted
- Reduce animation complexity on mobile
- Use CSS animations instead of JS where possible
- Load decorative animations only when in viewport

---

### 🟡 MEDIUM: No Code Splitting (Priority 3)

**Location:** `src/App.tsx`, `vite.config.ts`

**Issues:**
- All components load immediately
- No lazy loading of below-the-fold content
- Large bundle size affects initial load time

**Impact:**
- Slower initial load on mobile networks
- Unnecessary JavaScript execution
- Higher memory usage

**Expected Fix:**
- Implement React.lazy() for below-the-fold components
- Code split heavy components (FounderVideo, Philosophy, VisualShowcase)
- Load components only when needed

---

### 🟡 MEDIUM: Images Not Lazy Loaded (Priority 3)

**Location:** `src/components/VisualShowcase.tsx` (lines 97-112), `src/components/Philosophy.tsx` (PhilosophyImage component)

**Issues:**
- Images load immediately even when below the fold
- No `loading="lazy"` attribute
- No intersection observer for lazy loading

**Impact:**
- Wastes bandwidth on mobile
- Slows initial page load
- Can cause layout shifts

**Expected Fix:**
- Add `loading="lazy"` to all below-the-fold images
- Implement intersection observer for better control
- Use responsive images with `srcset`

---

### 🟡 MEDIUM: Window Size Checks During Render (Priority 3)

**Location:** Multiple components (Hero.tsx line 22, Philosophy.tsx line 65, VisualShowcase.tsx line 19)

**Issues:**
- `window.innerWidth` checks during render
- Can cause hydration mismatches
- Not SSR-safe (though app is client-only)

**Impact:**
- Potential hydration warnings
- Layout shifts
- Inconsistent behavior between server and client

**Expected Fix:**
- Use CSS media queries instead of JS where possible
- Move checks to `useLayoutEffect` if needed
- Use `useMediaQuery` hook with proper SSR handling

---

### 🟢 LOW: No Video Optimization Strategy (Priority 4)

**Location:** `src/components/Hero.tsx`, `public/workout.mp4`

**Issues:**
- No mobile-specific video encoding
- No multiple quality sources
- Large video file likely not optimized for mobile

**Impact:**
- Slow loading on mobile networks
- High bandwidth usage
- Poor user experience on slow connections

**Expected Fix:**
- Provide multiple video sources (mobile vs desktop)
- Use lower bitrate for mobile
- Consider WebM format for better compression
- Implement adaptive streaming if possible

---

## Prioritized Fix Plan

### Phase 1: Critical Fixes (Immediate Impact)

1. **Fix H1 Text Rendering**
   - Make H1 visible immediately with CSS
   - Defer SVG mask positioning
   - Ensure text renders even if JS fails

2. **Fix Hero Video Loading**
   - Add `preload="none"`
   - Implement poster image
   - Lazy load video (viewport or interaction)
   - Add mobile-specific handling

3. **Optimize Hero useEffect**
   - Split into prioritized chunks
   - Defer non-critical animations
   - Use `requestIdleCallback` for decorative elements

### Phase 2: High Impact Fixes

4. **Defer Spiral Animations**
   - Load only after hero content paints
   - Reduce complexity on mobile
   - Use CSS where possible

5. **Implement Code Splitting**
   - Lazy load below-the-fold components
   - Split heavy components

6. **Lazy Load Images**
   - Add `loading="lazy"` to below-the-fold images
   - Implement intersection observer

### Phase 3: Optimization

7. **Fix Window Size Checks**
   - Use CSS media queries
   - Proper useLayoutEffect usage

8. **Video Optimization**
   - Mobile-specific video sources
   - Multiple quality options

---

## Specific Recommendations

### Video Handling

**Immediate Actions:**
- Add `preload="none"` to hero video
- Create poster image (`/workout-poster.jpg`)
- Implement lazy loading with Intersection Observer
- Only load video when:
  - User scrolls near hero section, OR
  - User interacts with page (click/touch)

**Mobile-Specific:**
- Consider showing poster image only on mobile initially
- Load video on user interaction
- Use lower quality video source for mobile if available

### Hero Rendering

**Immediate Actions:**
- Render visible H1 text immediately (remove opacity: 0)
- Position SVG mask asynchronously after paint
- Ensure hero height is stable (use CSS min-height)
- Load background layers first, video last

**Rendering Order:**
1. Background gradients (CSS)
2. H1 text (visible)
3. Subtitle text
4. CTA button
5. Decorative elements (spirals, grid)
6. Video (lazy loaded)

### Animation Gating

**Strategy:**
- Critical animations: Load immediately (text fade-in)
- Important animations: Load after first paint (subtitle reveal)
- Decorative animations: Load after idle (spirals, grid)

**Implementation:**
- Use `requestIdleCallback` for decorative animations
- Reduce animation complexity on mobile
- Disable parallax on mobile (already done, but verify)

### Asset Loading

**Priority Order:**
1. **Critical:** Hero text, CTA button, basic layout
2. **Important:** Subtitle, background gradients
3. **Enhancement:** Video, decorative animations
4. **Below Fold:** All other sections

**Loading Strategy:**
- Critical: Load immediately
- Important: Load after first paint
- Enhancement: Load after idle or on interaction
- Below Fold: Lazy load with Intersection Observer

---

## Expected Outcomes

After implementing these fixes:

✅ **Hero text appears immediately** on mobile devices
✅ **Layout is stable** - no layout shifts
✅ **Video enhances, not dominates** - loads only when appropriate
✅ **Animations feel smooth** - not delayed or janky
✅ **Page feels fast** - intentional loading order
✅ **No desktop regressions** - all fixes are mobile-specific or progressive

---

## Testing Checklist

After fixes, test on:

- [ ] Real Android device (mid-range)
- [ ] Real iOS device
- [ ] Slow 3G network simulation
- [ ] Fast 4G network
- [ ] Desktop (verify no regressions)
- [ ] Browser DevTools mobile simulation

**Key Metrics to Monitor:**
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1

---

## Notes

- All fixes preserve desktop behavior
- No UI redesign required
- Premium motion preserved where possible
- Mobile optimizations are progressive enhancements

