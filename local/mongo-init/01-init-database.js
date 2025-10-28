// MongoDB initialization script for Boring Media Co
// This script will run automatically when MongoDB starts for the first time

// Connect to the boringmedia database
db = db.getSiblingDB('boringmedia');

// Create collections
db.createCollection('videos');
db.createCollection('users');
db.createCollection('comments');

print('✅ Created collections: videos, users, comments');

// Insert initial users
db.users.insertMany([
  {
    username: 'tomonthypond',
    name: 'Tomonthy Pond',
    email: 'tom@boringmedia.co',
    avatar: '/images/bpclogo.png',
    bio: 'Content creator sharing insights on technology, media, and digital innovation.',
    subscribers: 15420,
    totalVideos: 2,
    totalViews: 5577,
    joinDate: new Date('2023-01-01'),
    subscriptions: []
  },
  {
    username: 'jasonperez',
    name: 'Jason Perez',
    email: 'jason@boringmedia.co',
    avatar: 'https://via.placeholder.com/40/FF4081/FFFFFF?text=JP',
    bio: 'Security expert and tech enthusiast.',
    subscribers: 11200,
    totalVideos: 2,
    totalViews: 4686,
    joinDate: new Date('2023-02-15'),
    subscriptions: []
  }
]);

print('✅ Inserted 2 users');

// Insert initial videos
db.videos.insertMany([
  {
    title: 'Prioritize',
    description: 'Prioritize: Understanding and Mitigating Cyber Risks. Learn how to effectively prioritize and mitigate cyber risks in your organization.',
    uploader: {
      id: db.users.findOne({ username: 'tomonthypond' })._id.toString(),
      name: 'Tomonthy Pond',
      username: 'tomonthypond',
      avatar: '/images/bpclogo.png'
    },
    videoUrl: '/videos/Prioritize.mp4',
    thumbnailUrl: '/videos/Prioritize.mp4',
    duration: 342,
    category: 'Security',
    views: 3421,
    likes: 187,
    dislikes: 5,
    uploadDate: new Date('2024-01-15'),
    tags: ['security', 'risk', 'prioritize'],
    comments: []
  },
  {
    title: 'Mitigate',
    description: 'Mitigate: Advanced Threat Protection Strategies. Dive deep into advanced threat mitigation techniques.',
    uploader: {
      id: db.users.findOne({ username: 'tomonthypond' })._id.toString(),
      name: 'Tomonthy Pond',
      username: 'tomonthypond',
      avatar: '/images/bpclogo.png'
    },
    videoUrl: '/videos/Mitigate.mp4',
    thumbnailUrl: '/videos/Mitigate.mp4',
    duration: 278,
    category: 'Security',
    views: 2156,
    likes: 98,
    dislikes: 2,
    uploadDate: new Date('2024-01-08'),
    tags: ['security', 'threat', 'mitigation'],
    comments: []
  },
  {
    title: 'Risk Visualize',
    description: 'Risk Visualize: Interactive Data for Security Analytics. Discover how to visualize security risks with interactive dashboards.',
    uploader: {
      id: db.users.findOne({ username: 'jasonperez' })._id.toString(),
      name: 'Jason Perez',
      username: 'jasonperez',
      avatar: 'https://via.placeholder.com/40/FF4081/FFFFFF?text=JP'
    },
    videoUrl: '/videos/RiskVisualize.mp4',
    thumbnailUrl: '/videos/RiskVisualize.mp4',
    duration: 375,
    category: 'Security',
    views: 1897,
    likes: 134,
    dislikes: 1,
    uploadDate: new Date('2024-01-01'),
    tags: ['security', 'analytics', 'visualization'],
    comments: [
      {
        id: 'comment_' + new Date().getTime(),
        author: 'DataDefender',
        authorAvatar: 'https://via.placeholder.com/40/2196F3/FFFFFF?text=DD',
        text: 'The visualization tools are impressive!',
        timestamp: new Date('2024-01-05'),
        likes: 12
      }
    ]
  },
  {
    title: 'Proactive',
    description: 'Proactive: Building a Resilient Security Architecture. Learn how to build proactive security systems.',
    uploader: {
      id: db.users.findOne({ username: 'jasonperez' })._id.toString(),
      name: 'Jason Perez',
      username: 'jasonperez',
      avatar: 'https://via.placeholder.com/40/FF4081/FFFFFF?text=JP'
    },
    videoUrl: '/videos/Proactive.mp4',
    thumbnailUrl: '/videos/Proactive.mp4',
    duration: 388,
    category: 'Security',
    views: 2789,
    likes: 156,
    dislikes: 3,
    uploadDate: new Date('2023-12-20'),
    tags: ['security', 'architecture', 'proactive'],
    comments: [
      {
        id: 'comment_' + (new Date().getTime() + 1),
        author: 'ResilientSec',
        authorAvatar: 'https://via.placeholder.com/40/FF4081/FFFFFF?text=RS',
        text: 'Crucial information for modern security teams.',
        timestamp: new Date('2024-01-01'),
        likes: 8
      }
    ]
  }
]);

print('✅ Inserted 4 videos');

// Create indexes for better query performance
db.videos.createIndex({ 'uploader.id': 1 });
db.videos.createIndex({ uploadDate: -1 });
db.videos.createIndex({ views: -1 });
db.videos.createIndex({ category: 1 });
db.videos.createIndex({ tags: 1 });

print('✅ Created indexes on videos collection');

db.users.createIndex({ username: 1 });
db.users.createIndex({ 'subscriptions': 1 });

print('✅ Created indexes on users collection');

print('🎉 MongoDB initialization complete!');
print('📊 Database: boringmedia');
print('📁 Collections: videos, users, comments');
print('👥 Users: 2');
print('🎬 Videos: 4');

