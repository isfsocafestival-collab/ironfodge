# Video Setup Guide

## Option 1: Local Video File

1. Place your founder video file in the `public` directory:
   ```
   public/founder-video.mp4
   ```

2. The video will be automatically served at `/founder-video.mp4`

3. Supported formats: MP4, WebM, OGG

## Option 2: YouTube Embed

If you want to use a YouTube video instead, update `src/components/FounderVideo.tsx`:

Replace the video element with:

```tsx
<iframe
  className="w-full h-full"
  src={`https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=${isPlaying ? 1 : 0}&controls=${isPlaying ? 1 : 0}`}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  style={{ opacity: isPlaying ? 1 : 0 }}
/>
```

## Option 3: Vimeo Embed

For Vimeo, use:

```tsx
<iframe
  className="w-full h-full"
  src={`https://player.vimeo.com/video/YOUR_VIDEO_ID?autoplay=${isPlaying ? 1 : 0}`}
  allow="autoplay; fullscreen; picture-in-picture"
  allowFullScreen
  style={{ opacity: isPlaying ? 1 : 0 }}
/>
```

## Video Specifications

For best results, use:
- **Resolution**: 1920x1080 (1080p) or higher
- **Aspect Ratio**: 16:9 (recommended) or 4:3
- **Format**: MP4 (H.264 codec)
- **File Size**: Optimize for web (aim for < 50MB if possible)

## Testing

1. Make sure the video plays correctly in the browser
2. Test the play button interaction
3. Verify the fade-in animation works smoothly
4. Check mobile responsiveness











