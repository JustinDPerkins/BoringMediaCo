import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface VideoCard {
  id: string;
  title: string;
  uploader: string;
  views: number;
  likes: number;
  videoSrc: string;
  duration: string;
  category: string;
}

const allVideos: VideoCard[] = [
  {
    id: '1',
    title: 'Prioritize',
    uploader: 'Tomonthy Pond',
    views: 3421,
    likes: 187,
    videoSrc: '/videos/Prioritize.mp4',
    duration: '5:42',
    category: 'Security',
  },
  {
    id: '2',
    title: 'Mitigate',
    uploader: 'Tomonthy Pond',
    views: 2156,
    likes: 98,
    videoSrc: '/videos/Mitigate.mp4',
    duration: '4:38',
    category: 'Security',
  },
  {
    id: '3',
    title: 'Risk Visualize',
    uploader: 'Jason Perez',
    views: 1897,
    likes: 134,
    videoSrc: '/videos/RiskVisualize.mp4',
    duration: '6:15',
    category: 'Security',
  },
  {
    id: '4',
    title: 'Proactive',
    uploader: 'Jason Perez',
    views: 2789,
    likes: 156,
    videoSrc: '/videos/Proactive.mp4',
    duration: '6:28',
    category: 'Security',
  },
];

const Library: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [displayVideos, setDisplayVideos] = useState<VideoCard[]>(allVideos);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if we have search results from navigation
    const state = location.state as any;
    if (state?.searchResults && state.searchResults.length > 0) {
      // Convert search results to VideoCard format
      const formattedVideos = state.searchResults.map((v: any) => ({
        id: v._id || v.id,
        title: v.title,
        uploader: v.uploader?.name || 'Unknown',
        views: v.views || 0,
        likes: v.likes || 0,
        videoSrc: v.videoUrl || '',
        duration: `${Math.floor((v.duration || 0) / 60)}:${String((v.duration || 0) % 60).padStart(2, '0')}`,
        category: v.category || 'Uncategorized',
      }));
      setDisplayVideos(formattedVideos);
    }

    // Check if there's a search query in URL
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: '#f5f1e8',
            }}
          >
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Video Library'}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(245, 241, 232, 0.7)' }}
          >
            {displayVideos.length} {displayVideos.length === 1 ? 'video' : 'videos'} {searchQuery ? 'found' : 'available'}
          </Typography>
        </Box>

        {/* Video Grid */}
        {displayVideos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'rgba(245, 241, 232, 0.7)', mb: 2 }}>
              No videos found
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.5)' }}>
              Try searching for something else
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {displayVideos.map((video) => (
            <Card
              key={video.id}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              onClick={() => navigate(`/watch/${video.id}`)}
            >
              {/* Thumbnail */}
              <Box sx={{ position: 'relative', aspectRatio: '16/9' }}>
                <video
                  src={video.videoSrc}
                  muted
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.currentTime = 3.0;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    background: '#000',
                  }}
                />
                {/* Play Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.3)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                {/* Duration */}
                <Chip
                  label={video.duration}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* Video Info */}
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#f5f1e8',
                    mb: 1,
                    fontSize: '0.95rem',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {video.title}
                </Typography>

                {/* Uploader */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                    {video.uploader[0]}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(245, 241, 232, 0.8)', fontSize: '0.875rem' }}
                  >
                    {video.uploader}
                  </Typography>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VisibilityIcon sx={{ fontSize: 16, color: 'rgba(245, 241, 232, 0.6)' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
                      {video.views.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ThumbUpIcon sx={{ fontSize: 16, color: 'rgba(245, 241, 232, 0.6)' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
                      {video.likes}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Library;
