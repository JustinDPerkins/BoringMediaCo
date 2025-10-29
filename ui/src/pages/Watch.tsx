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
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  PlaylistAdd as SaveIcon,
  Reply as ReplyIcon,
  Visibility as ViewsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import WebTerminal from '../components/WebTerminal';

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
  comments?: Comment[];
}

interface Comment {
  id: string;
  author: string;
  authorUsername: string;
  authorAvatar: string;
  text: string;
  timestamp: Date | string;
  likes: number;
}

const formatTimestamp = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

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
    comments: [
      {
        id: 'c1',
        author: 'Sarah Chen',
        authorUsername: 'cybersafetyexpert',
        authorAvatar: 'https://via.placeholder.com/40/4CAF50/FFFFFF?text=SC',
        text: 'Great overview! I use similar prioritization frameworks in my security assessments.',
        timestamp: new Date('2024-01-16'),
        likes: 23
      },
      {
        id: 'c2',
        author: 'Marcus Thompson',
        authorUsername: 'devopsguru',
        authorAvatar: 'https://via.placeholder.com/40/FF9800/FFFFFF?text=MT',
        text: 'This aligns perfectly with the OWASP Top 10. Excellent explanation!',
        timestamp: new Date('2024-01-17'),
        likes: 15
      }
    ]
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
    comments: [
      {
        id: 'c3',
        author: 'Alex Rivera',
        authorUsername: 'cloudarchitect',
        authorAvatar: 'https://via.placeholder.com/40/2196F3/FFFFFF?text=AR',
        text: 'Great strategies! Have you tried implementing any of these in AWS/Azure environments?',
        timestamp: new Date('2024-01-09'),
        likes: 12
      },
      {
        id: 'c4',
        author: 'Emily Wang',
        authorUsername: 'securityresearcher',
        authorAvatar: 'https://via.placeholder.com/40/9C27B0/FFFFFF?text=EW',
        text: 'The threat modeling approach here is spot on. Thanks for sharing!',
        timestamp: new Date('2024-01-10'),
        likes: 19
      }
    ]
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
    comments: [
      {
        id: 'c5',
        author: 'DataDefender',
        authorUsername: 'datadefender',
        authorAvatar: 'https://via.placeholder.com/40/2196F3/FFFFFF?text=DD',
        text: 'The visualization tools are impressive! Which library did you use for the charts?',
        timestamp: new Date('2024-01-05'),
        likes: 12
      },
      {
        id: 'c6',
        author: 'Marcus Thompson',
        authorUsername: 'devopsguru',
        authorAvatar: 'https://via.placeholder.com/40/FF9800/FFFFFF?text=MT',
        text: 'I implemented something similar in Grafana. This approach is way better!',
        timestamp: new Date('2024-01-06'),
        likes: 8
      }
    ]
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
    comments: [
      {
        id: 'c7',
        author: 'ResilientSec',
        authorUsername: 'resilientsec',
        authorAvatar: 'https://via.placeholder.com/40/FF4081/FFFFFF?text=RS',
        text: 'Crucial information for modern security teams. Planning to implement this architecture!',
        timestamp: new Date('2024-01-01'),
        likes: 8
      },
      {
        id: 'c8',
        author: 'James Mitchell',
        authorUsername: 'pentesterpro',
        authorAvatar: 'https://via.placeholder.com/40/E91E63/FFFFFF?text=JM',
        text: 'The proactive defense model you outlined is exactly what I advise clients. Well explained!',
        timestamp: new Date('2024-01-02'),
        likes: 14
      }
    ]
  },
];

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Try to find video in local mock data first (for legacy IDs like '1', '2')
  let video = allVideos.find((v) => v.id === id);
  
  // If not found in local data, try to look up by MongoDB ID
  if (!video && id && id.length > 10) {
    // This looks like a MongoDB ID, find in allVideos array
    // For now, just use a fallback video until we fetch from API
    video = allVideos[0]; // Use first video as fallback
  }
  
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(video?.likes || 0);
  const [dislikes, setDislikes] = useState(video?.dislikes || 0);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      // Trigger terminal popup when user tries to comment
      setTerminalOpen(true);
      console.log('Comment submitted:', commentText);
      // In a real scenario, this would send the comment to the backend
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
              {video.comments?.length || 0} Comments
            </Typography>

            <Box 
              component="form" 
              onSubmit={handleCommentSubmit}
              sx={{ display: 'flex', gap: 2, mb: 3 }}
            >
              <Avatar sx={{ width: 40, height: 40 }}>Y</Avatar>
              <TextField
                fullWidth
                placeholder="Add a comment..."
                variant="outlined"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit(e);
                  }
                }}
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

            {/* Comments from MongoDB */}
            <Stack spacing={2}>
              {video.comments && video.comments.length > 0 ? (
                video.comments.map((comment: any, index: number) => (
                  <Box key={comment.id || index} sx={{ display: 'flex', gap: 2 }}>
                    <Avatar 
                      src={comment.authorAvatar} 
                      sx={{ width: 40, height: 40 }}
                    >
                      {comment.author[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#f5f1e8' }}>
                        {comment.author} • {formatTimestamp(comment.timestamp)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.8)', mt: 0.5 }}>
                        {comment.text}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          <ThumbUpIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          {comment.likes || 0}
                        </Typography>
                        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          <ReplyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.6)', textAlign: 'center', py: 4 }}>
                  No comments yet. Be the first to comment!
                </Typography>
              )}
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

      {/* WebTerminal Modal */}
      <Dialog
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: '#f5f1e8',
            height: '80vh',
            maxHeight: '800px',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ color: '#f5f1e8' }}>
            Terminal Access
          </Typography>
          <IconButton onClick={() => setTerminalOpen(false)} sx={{ color: '#f5f1e8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, position: 'relative', height: '100%' }}>
            <WebTerminal />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Watch;

