# Video Files Directory

## Where to Place Your Videos

Place your video files in this directory:

```
ui/public/videos/
├── your-video-1.mp4
├── your-video-2.mp4
├── your-video-3.webm
└── ...
```

## Supported Formats

- MP4 (recommended)
- WebM
- OGG
- MOV

## Adding Videos to Docker

Videos are automatically served when you build the Docker container. They're included in the static build.

### Steps:

1. **Add your video files** to `ui/public/videos/`

2. **Add thumbnails** to `ui/public/images/` with matching names:
   - `your-video-1.mp4` → `your-video-1.png` or `.jpg`
   - `your-video-2.mp4` → `your-video-2.png` or `.jpg`

3. **Update the mock videos** in `ui/src/pages/Home.tsx` or `ui/src/pages/Library.tsx`:
   ```typescript
   {
     id: '5',
     title: 'Your Video Title',
     uploader: 'Your Name',
     views: 0,
     likes: 0,
     thumbnail: '/images/your-video-1.png',
     duration: '5:00',
     category: 'Your Category',
   }
   ```

4. **Rebuild and run**:
   ```bash
   cd local
   docker compose up --build ui
   ```

5. Access your videos at: `http://localhost:8080/videos/your-video-1.mp4`

## Using in Code

Reference videos like this:

```tsx
<video src="/videos/your-video-1.mp4" controls />
```

Or in IMG tags for thumbnails:

```tsx
<img src="/images/your-video-1.png" alt="Video thumbnail" />
```

## Notes

- Videos are served as static assets
- Large files will increase container size
- Consider using a CDN or object storage for production
- Maximum recommended file size: 50MB

