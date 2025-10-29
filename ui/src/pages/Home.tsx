import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RecommendIcon from '@mui/icons-material/Recommend';
import { videoApi } from '../services/api';

interface VideoCard {
  id: string;
  title: string;
  uploader: string;
  uploaderAvatar?: string;
  views: number;
  likes: number;
  thumbnail?: string; // Optional - can use video frame
  videoSrc?: string; // Actual video file path
  duration: string;
  category: string;
}

const mockVideos: VideoCard[] = [
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [recommendedVideo, setRecommendedVideo] = useState<VideoCard | null>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  useEffect(() => {
    // Fetch AI recommendation on mount
    const fetchRecommendation = async () => {
      setRecommendationLoading(true);
      try {
        console.log('Fetching recommendation...');
        const recommended = await videoApi.getRecommendation();
        console.log('Recommendation received:', recommended);
        
        if (recommended) {
          // Convert MongoDB video to VideoCard format
          // Handle both MongoDB ObjectId formats: string or { $oid: string }
          let videoId = '';
          if (typeof recommended._id === 'string') {
            videoId = recommended._id;
          } else if (typeof recommended._id === 'object' && recommended._id !== null) {
            videoId = (recommended._id as any).$oid || String(recommended._id);
          } else {
            videoId = String(recommended._id);
          }
          
          const videoCard: VideoCard = {
            id: videoId,
            title: recommended.title,
            uploader: recommended.uploader?.name || 'Unknown',
            views: recommended.views || 0,
            likes: recommended.likes || 0,
            videoSrc: recommended.videoUrl,
            duration: `${Math.floor((recommended.duration || 0) / 60)}:${String((recommended.duration || 0) % 60).padStart(2, '0')}`,
            category: recommended.category || 'Uncategorized',
          };
          
          console.log('Video card created:', videoCard);
          setRecommendedVideo(videoCard);
        }
      } catch (error) {
        console.error('Failed to load recommendation:', error);
      } finally {
        setRecommendationLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

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
            Welcome to Boring Media Co
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(245, 241, 232, 0.7)' }}
          >
            Watch, upload, and share your favorite videos
          </Typography>
        </Box>

        {/* AI Recommendation Section */}
        {recommendationLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CircularProgress sx={{ color: '#2196F3' }} />
          </Box>
        ) : recommendedVideo ? (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <RecommendIcon sx={{ color: '#2196F3', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#f5f1e8' }}>
                AI Recommendation of the Day
              </Typography>
            </Box>
            <Card
              onClick={() => navigate(`/watch/${recommendedVideo.id}`)}
              sx={{
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
                border: '2px solid #2196F3',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 32px rgba(33, 150, 243, 0.3)',
                  borderColor: '#42A5F5',
                },
              }}
            >
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Thumbnail */}
                <Box sx={{ width: { xs: '100%', md: '640px' }, aspectRatio: '16/9', flexShrink: 0 }}>
                  <video
                    src={recommendedVideo.videoSrc}
                    muted
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      e.currentTarget.currentTime = 3.0;
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      background: '#000',
                    }}
                  />
                </Box>
                {/* Info */}
                <CardContent sx={{ p: 3, flex: 1 }}>
                  <Chip
                    label="AI Picked"
                    sx={{
                      bgcolor: '#2196F3',
                      color: 'white',
                      mb: 2,
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f5f1e8', mb: 2 }}>
                    {recommendedVideo.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {recommendedVideo.uploader[0]}
                    </Avatar>
                    <Typography variant="body1" sx={{ color: '#f5f1e8' }}>
                      {recommendedVideo.uploader}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon sx={{ fontSize: 20, color: 'rgba(245, 241, 232, 0.8)' }} />
                      <Typography variant="body1" sx={{ color: 'rgba(245, 241, 232, 0.8)' }}>
                        {recommendedVideo.views.toLocaleString()} views
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ThumbUpIcon sx={{ fontSize: 20, color: 'rgba(245, 241, 232, 0.8)' }} />
                      <Typography variant="body1" sx={{ color: 'rgba(245, 241, 232, 0.8)' }}>
                        {recommendedVideo.likes}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </Box>
        ) : null}

        {/* Quick Access Section */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#f5f1e8',
            }}
          >
            Quick Access
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Card
              onClick={() => navigate('/library')}
              sx={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: '#4caf50',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#f5f1e8', mb: 1 }}>
                  Browse Library
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                  Explore trending videos and collections
                </Typography>
              </CardContent>
            </Card>
            <Card
              onClick={() => navigate('/submissions')}
              sx={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: '#2196f3',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#f5f1e8', mb: 1 }}>
                  Upload Video
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                  Share your content with the community
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Hidden Video Grid - for reference */}
        {false && (
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
            {mockVideos.map((video) => (
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
                {video.videoSrc ? (
                  // Use actual video frame as thumbnail - seek to 3 seconds
                  <video
                    src={video.videoSrc}
                    muted
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      // Seek to 3 seconds for thumbnail
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
                ) : (
                  // Fallback to static image
                  <CardMedia
                    component="img"
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
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

export default Home;
