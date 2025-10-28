import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Divider,
  Paper,
  TextField,
  Stack,
  Card,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  PlaylistAdd as SaveIcon,
  Reply as ReplyIcon,
  Visibility as ViewsIcon,
} from '@mui/icons-material';

interface Video {
  id: string;
  title: string;
  uploader: string;
  uploaderAvatar?: string;
  views: number;
  likes: number;
  dislikes: number;
  videoSrc: string;
  duration: string;
  category: string;
  description: string;
  uploadDate: string;
}

const allVideos: Video[] = [
  {
    id: '1',
    title: 'Prioritize',
    uploader: 'Tomonthy Pond',
    views: 3421,
    likes: 187,
    dislikes: 3,
    videoSrc: '/videos/Prioritize.mp4',
    duration: '5:42',
    category: 'Security',
    description: 'Learn how to prioritize security threats effectively. This video covers essential techniques for identifying and addressing the most critical security issues in your organization.',
    uploadDate: '3 days ago',
  },
  {
    id: '2',
    title: 'Mitigate',
    uploader: 'Tomonthy Pond',
    views: 2156,
    likes: 98,
    dislikes: 2,
    videoSrc: '/videos/Mitigate.mp4',
    duration: '4:38',
    category: 'Security',
    description: 'Comprehensive guide to mitigating security risks. Explore best practices and proven strategies for reducing vulnerabilities in your systems.',
    uploadDate: '1 week ago',
  },
  {
    id: '3',
    title: 'Risk Visualize',
    uploader: 'Jason Perez',
    views: 1897,
    likes: 134,
    dislikes: 4,
    videoSrc: '/videos/RiskVisualize.mp4',
    duration: '6:15',
    category: 'Security',
    description: 'Visualizing security risks effectively. Learn how to create compelling dashboards and reports that make complex security data easy to understand.',
    uploadDate: '2 weeks ago',
  },
  {
    id: '4',
    title: 'Proactive',
    uploader: 'Jason Perez',
    views: 2789,
    likes: 156,
    dislikes: 5,
    videoSrc: '/videos/Proactive.mp4',
    duration: '6:28',
    category: 'Security',
    description: 'Being proactive in security management. Discover how to stay ahead of threats and implement preventative measures before issues arise.',
    uploadDate: '3 weeks ago',
  },
];

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const video = allVideos.find((v) => v.id === id);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(video?.likes || 0);
  const [dislikes, setDislikes] = useState(video?.dislikes || 0);

  if (!video) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Video not found</Typography>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </Box>
    );
  }

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setDisliked(true);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
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
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Video Section */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Video Player */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                background: '#000',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2,
              }}
            >
              <video
                src={video.videoSrc}
                controls
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>

            {/* Video Title and Stats */}
            <Typography variant="h5" sx={{ color: '#f5f1e8', mb: 1, fontWeight: 600 }}>
              {video.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewsIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                  {video.views.toLocaleString()} views • {video.uploadDate}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Button
                startIcon={<ThumbUpIcon />}
                onClick={handleLike}
                variant={liked ? 'contained' : 'outlined'}
                sx={{
                  borderColor: liked ? '#2196F3' : 'rgba(255,255,255,0.2)',
                  color: liked ? '#fff' : 'rgba(255,255,255,0.8)',
                }}
              >
                {likes}
              </Button>
              <Button
                startIcon={<ThumbDownIcon />}
                onClick={handleDislike}
                variant={disliked ? 'contained' : 'outlined'}
                sx={{
                  borderColor: disliked ? '#2196F3' : 'rgba(255,255,255,0.2)',
                  color: disliked ? '#fff' : 'rgba(255,255,255,0.8)',
                }}
              >
                {dislikes}
              </Button>
              <Button startIcon={<ShareIcon />} variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                Share
              </Button>
              <Button startIcon={<SaveIcon />} variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                Save
              </Button>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />

            {/* Uploader Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48 }}>{video.uploader[0]}</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: '#f5f1e8' }}>
                    {video.uploader}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
                    1.2K subscribers
                  </Typography>
                </Box>
              </Box>
              <Button variant="contained" sx={{ bgcolor: '#2196F3' }}>
                Subscribe
              </Button>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

            {/* Description */}
            <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.05)', mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#f5f1e8', whiteSpace: 'pre-wrap' }}>
                {video.description}
              </Typography>
            </Paper>

            {/* Comments Section */}
            <Typography variant="h6" sx={{ color: '#f5f1e8', mb: 2 }}>
              12 Comments
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 40, height: 40 }}>Y</Avatar>
              <TextField
                fullWidth
                placeholder="Add a comment..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f5f1e8',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                }}
              />
            </Box>

            {/* Sample Comments */}
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {String.fromCharCode(65 + i)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#f5f1e8' }}>
                      User {i} • {i === 1 ? '2 hours ago' : i === 2 ? '5 hours ago' : '1 day ago'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.8)', mt: 0.5 }}>
                      Great video! Very informative and well explained.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <IconButton size="small">
                        <ThumbUpIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton size="small">
                        <ReplyIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Sidebar - Related Videos */}
          <Box sx={{ width: { xs: '100%', lg: '400px' }, flexShrink: 0 }}>
            <Typography variant="h6" sx={{ color: '#f5f1e8', mb: 2 }}>
              Up Next
            </Typography>
            <Stack spacing={2}>
              {allVideos
                .filter((v) => v.id !== video.id)
                .slice(0, 4)
                .map((relatedVideo) => (
                  <Card
                    key={relatedVideo.id}
                    onClick={() => navigate(`/watch/${relatedVideo.id}`)}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 160,
                        height: 90,
                        flexShrink: 0,
                        position: 'relative',
                        background: '#000',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <video
                        src={relatedVideo.videoSrc}
                        muted
                        preload="metadata"
                        onLoadedMetadata={(e) => {
                          e.currentTarget.currentTime = 3.0;
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#f5f1e8',
                          fontWeight: 600,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {relatedVideo.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                        {relatedVideo.uploader}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(245, 241, 232, 0.7)', display: 'block' }}>
                        {relatedVideo.views.toLocaleString()} views
                      </Typography>
                    </Box>
                  </Card>
                ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Watch;

