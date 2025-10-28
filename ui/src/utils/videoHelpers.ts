// Helper functions to convert between MongoDB Video format and UI VideoCard format

export interface VideoCard {
  id: string;
  title: string;
  uploader: string;
  uploaderAvatar?: string;
  views: number;
  likes: number;
  thumbnail?: string;
  videoSrc: string;
  duration: string;
  category: string;
}

export interface VideoFromMongoDB {
  _id: string;
  title: string;
  description: string;
  uploader: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  category: string;
  views: number;
  likes: number;
  dislikes: number;
  uploadDate: string;
  tags: string[];
  comments: any[];
}

/**
 * Convert MongoDB video format to UI VideoCard format
 */
export const convertMongoVideoToCard = (video: VideoFromMongoDB): VideoCard => {
  // Convert duration from seconds to "MM:SS" format
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    id: video._id,
    title: video.title,
    uploader: video.uploader.name,
    uploaderAvatar: video.uploader.avatar,
    views: video.views,
    likes: video.likes,
    thumbnail: video.thumbnailUrl,
    videoSrc: video.videoUrl,
    duration: formatDuration(video.duration),
    category: video.category,
  };
};

/**
 * Convert array of MongoDB videos to VideoCard array
 */
export const convertMongoVideosToCards = (videos: VideoFromMongoDB[]): VideoCard[] => {
  return videos.map(convertMongoVideoToCard);
};

