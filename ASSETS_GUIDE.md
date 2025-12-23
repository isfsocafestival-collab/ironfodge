# Premium Assets Guide

This guide explains where to place your images and videos for the premium Ironforge landing page.

## Required Assets

### Hero Section
**Location:** `public/hero-image.jpg`
- **Dimensions:** 1920x1080px or higher
- **Format:** JPG, WebP, or PNG
- **Content:** Premium strength training imagery - athlete in motion, gym environment, or abstract strength concept
- **Style:** Dark, moody, cinematic. Should complement the dark theme.

### Philosophy Section Images
**Locations:**
- `public/philosophy-1.jpg` - Long-term strength training (decades of progress)
- `public/philosophy-2.jpg` - Core strength focus
- `public/philosophy-3.jpg` - Discipline and consistency
- `public/philosophy-4.jpg` - Precision and form

**Dimensions:** 1200x900px (4:3 aspect ratio)
**Format:** JPG or WebP
**Content:** Each image should visually represent the philosophy principle

### Visual Showcase
**Locations:**
- `public/showcase-1.jpg` - Strength training session
- `public/showcase-2.jpg` - Core strength focus  
- `public/showcase-3.jpg` - Precision movement

**Dimensions:** 800x1067px (3:4 aspect ratio - portrait)
**Format:** JPG or WebP
**Content:** Premium action shots showing the methodology

### Founder Video
**Location:** `public/founder-video.mp4`
- **Resolution:** 1920x1080 (1080p) or higher
- **Format:** MP4 (H.264 codec)
- **Duration:** 2-5 minutes recommended
- **Content:** Founder explaining the Ironforge philosophy

## Image Guidelines

### Style & Aesthetic
- **Color Palette:** Dark, moody tones that complement the red accent (#DC2626)
- **Lighting:** Dramatic, cinematic lighting
- **Composition:** Clean, focused, professional
- **Mood:** Serious, disciplined, premium

### Technical Specifications
- **Compression:** Optimize for web (aim for < 500KB per image)
- **Quality:** High resolution but optimized
- **Format:** WebP preferred, JPG fallback
- **Aspect Ratios:** Maintain specified ratios for best display

## Fallback Behavior

All images have graceful fallbacks:
- If an image doesn't exist, a gradient placeholder with the section number appears
- The design remains premium even without images
- No broken image icons will appear

## Recommended Sources

For premium fitness imagery:
- Unsplash (search: "strength training", "gym", "fitness")
- Pexels (search: "athlete", "workout", "strength")
- Custom photography (recommended for brand authenticity)

## Video Specifications

- **Codec:** H.264
- **Bitrate:** 5-8 Mbps for 1080p
- **Frame Rate:** 24fps or 30fps
- **Audio:** Stereo, 48kHz
- **File Size:** Optimize to < 50MB if possible

## Testing

After adding assets:
1. Check all images load correctly
2. Verify aspect ratios display properly
3. Test on different screen sizes
4. Ensure videos play smoothly
5. Check fallback behavior (temporarily rename files)

## Performance Tips

- Use WebP format for better compression
- Lazy load images (already implemented)
- Optimize video for web streaming
- Consider using a CDN for production


