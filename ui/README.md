# Boring Media Co - TypeScript Edition

A modern TypeScript React application for a video streaming platform where users can watch and upload videos.

## Features

- 🎬 **Video Streaming** - Browse and watch trending videos
- 📤 **Video Upload** - Upload your own videos to share with the community
- 📋 **Watch List** - Save videos for later viewing
- 🤖 **AI Chat Assistant** - Interactive chatbot with security controls
- 📤 **File Upload** - Secure file scanning with backend API integration
- 🎨 **Vintage Theme** - Dark, elegant design with creamy accents
- ⚡ **TypeScript** - Fully typed for better development experience
- 🚀 **Vite** - Fast development and optimized builds

## Tech Stack

- **React 18** with TypeScript
- **Material-UI** (MUI) v7 for components
- **React Router** for navigation
- **Vite** for build tooling
- **Context API** for state management
- **Backend APIs** - SDK, Chat, XDR services

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Runs on http://localhost:3000

### Build

\`\`\`bash
npm run build
\`\`\`

### Preview

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
ui/
├── src/
│   ├── assets/          # Static assets (images, logos)
│   ├── components/       # Reusable components
│   ├── context/          # React Context providers
│   ├── pages/           # Page components
│   ├── theme/           # MUI theme configuration
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Public assets
└── package.json         # Dependencies
\`\`\`

## Features Overview

### Video Streaming
- View trending videos
- Explore video categories
- Search and discover content
- Watch videos in high quality

### Video Upload
- Upload video files (MP4, AVI, MOV)
- Share your content with the community
- Secure file scanning via API
- Real-time upload progress
- Video metadata management

### Watch List
- Save videos for later
- Manage your saved collection
- Quick access to your favorites
- Session persistence

### AI Chat Assistant
- Interactive chatbot with AI responses
- Security protection toggle
- Real-time message handling
- Error handling and recovery

### Backend API Integration
The app connects to backend services:
- `/api/chat/` - AI chat service (port 5001)
- `/api/sdk/` - File upload and scanning (port 5000)
- `/api/xdr/` - Container XDR service (port 8081, WebSocket)
- `/api/ollama/` - LLM service (port 11434)

## Development Notes

This is a demo/educational project showcasing:
- TypeScript best practices
- React Context API
- Material-UI theming
- File upload handling
- State management

Not intended for production use without additional security hardening.
