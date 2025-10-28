import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Chip,
  Paper,
  Divider,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Visibility as VisibilityIcon,
  CloudUpload as UploadIcon,
  PersonAdd as PersonAddIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';

interface UserVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  uploadDate: string;
  category: string;
}

// Initial user profile
const initialUser = {
  name: 'Tomonthy Pond',
  username: '@tomonthypond',
  bio: 'Content creator sharing insights on technology, media, and digital innovation. Welcome to my channel!',
  avatar: '/images/bpclogo.png',
  joinDate: 'January 2023',
  location: 'San Francisco, CA',
  subscribers: 15420,
  videos: 47,
  totalViews: 892340,
};

const userVideos: UserVideo[] = [
  {
    id: '1',
    title: 'Boring Media Co Platform Overview',
    thumbnail: '/images/camino.png',
    views: 1523,
    likes: 89,
    duration: '5:42',
    uploadDate: '3 days ago',
    category: 'Tutorial',
  },
  {
    id: '2',
    title: 'Getting Started with Video Uploads',
    thumbnail: '/images/office_building_draw.png',
    views: 892,
    likes: 45,
    duration: '8:15',
    uploadDate: '1 week ago',
    category: 'Guide',
  },
  {
    id: '3',
    title: 'Exploring the Video Library',
    thumbnail: '/images/people_office.jpg',
    views: 1247,
    likes: 67,
    duration: '12:03',
    uploadDate: '2 weeks ago',
    category: 'Demo',
  },
  {
    id: '4',
    title: 'Welcome to Boring Media Co',
    thumbnail: '/images/paper-hero.jpg',
    views: 2341,
    likes: 142,
    duration: '3:27',
    uploadDate: '3 weeks ago',
    category: 'Welcome',
  },
  {
    id: '5',
    title: 'Advanced Video Features',
    thumbnail: '/images/threat_level_midnight.png',
    views: 954,
    likes: 52,
    duration: '6:18',
    uploadDate: '1 month ago',
    category: 'Tutorial',
  },
  {
    id: '6',
    title: 'Platform Best Practices',
    thumbnail: '/images/pams_painting.jpeg',
    views: 1789,
    likes: 93,
    duration: '9:45',
    uploadDate: '1 month ago',
    category: 'Guide',
  },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({ ...user, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        py: 4,
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Profile Header */}
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              {/* Avatar */}
              <Box sx={{ flex: { xs: 'none', md: '0 0 25%' } }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mx: 'auto', mb: 2 }}>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 150,
                      height: 150,
                      filter: user.avatar === '/images/bpclogo.png' ? 'invert(1) brightness(1.2)' : 'none',
                      mixBlendMode: user.avatar === '/images/bpclogo.png' ? 'screen' : 'normal',
                      bgcolor: 'transparent',
                      border: '3px solid #2196F3',
                      cursor: 'pointer',
                    }}
                    onClick={handleAvatarClick}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#2196F3',
                      color: 'white',
                      border: '2px solid #0F0F0F',
                      '&:hover': {
                        bgcolor: '#1976D2',
                      },
                    }}
                  >
                    <CameraIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* User Info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: '#f5f1e8', mb: 1 }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: 'rgba(245, 241, 232, 0.7)', mb: 2 }}
                >
                  {user.username}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'rgba(245, 241, 232, 0.8)', mb: 3, lineHeight: 1.8 }}
                >
                  {user.bio}
                </Typography>

                {/* Meta Info */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
                    📍 {user.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
                    📅 Joined {user.joinDate}
                  </Typography>
                </Stack>
              </Box>
            </Box>

            {/* Stats */}
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center',
                }}
              >
                <PersonAddIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" sx={{ color: '#f5f1e8', fontWeight: 700 }}>
                  {user.subscribers.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                  Subscribers
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center',
                }}
              >
                <UploadIcon sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                <Typography variant="h4" sx={{ color: '#f5f1e8', fontWeight: 700 }}>
                  {user.videos}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                  Videos
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center',
                }}
              >
                <VisibilityIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" sx={{ color: '#f5f1e8', fontWeight: 700 }}>
                  {user.totalViews.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                  Total Views
                </Typography>
              </Paper>
            </Box>
          </CardContent>
        </Card>

        {/* User's Videos */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#f5f1e8',
            }}
          >
            My Videos
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {userVideos.map((video) => (
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
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: '#f5f1e8',
                      mb: 1,
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

                  {/* Stats */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon sx={{ fontSize: 12, color: 'rgba(245, 241, 232, 0.6)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
                        {video.views.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ThumbUpIcon sx={{ fontSize: 12, color: 'rgba(245, 241, 232, 0.6)' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
                        {video.likes}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Upload Date */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(245, 241, 232, 0.5)',
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    {video.uploadDate}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/submissions')}
            sx={{
              background: '#2196f3',
              color: 'white',
              px: 4,
              '&:hover': {
                background: '#1976d2',
              },
            }}
          >
            Upload New Video
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/library')}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#f5f1e8',
              px: 4,
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
            }}
          >
            Browse Library
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
