import { useState, useEffect } from 'react';
import { videoApi } from '../services/api';
import { convertMongoVideosToCards, VideoCard } from '../utils/videoHelpers';

// Fallback mock data
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

/**
 * Hook to fetch videos from MongoDB API with fallback to mock data
 */
export const useVideos = () => {
  const [videos, setVideos] = useState<VideoCard[]>(mockVideos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to fetch from MongoDB API
        const mongoVideos = await videoApi.getVideos();

        if (mongoVideos && mongoVideos.length > 0) {
          // Convert MongoDB format to UI format
          const convertedVideos = convertMongoVideosToCards(mongoVideos);
          setVideos(convertedVideos);
          setUsingMockData(false);
          console.log('✅ Loaded videos from MongoDB:', convertedVideos.length);
        } else {
          // Fallback to mock data
          setVideos(mockVideos);
          setUsingMockData(true);
          console.log('⚠️ MongoDB not available, using mock data');
        }
      } catch (err) {
        // On error, fallback to mock data
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
        setVideos(mockVideos);
        setUsingMockData(true);
        console.error('❌ Error fetching videos, using mock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error, usingMockData };
};

