# Boring Media Co - Local Development

## 🚀 Quick Start

```bash
cd local
docker compose up -d
```

Access the application at:
- **UI**: http://localhost:8080
- **MongoDB**: mongodb://localhost:27017
- **SDK API**: http://localhost:5050

## 📁 Directory Structure

```
local/
├── docker-compose.yml      # Docker Compose configuration
├── mongo-init/            # MongoDB initialization scripts
│   └── 01-init-database.js
└── README.md             # This file
```

## 🗄️ MongoDB Setup

### Database
- **Database Name**: `boringmedia`
- **Username**: `admin`
- **Password**: `password`

### Collections
- `videos` - Video metadata and information
- `users` - User profiles and subscriptions
- `comments` - Video comments

### Initial Data
The MongoDB initialization script (`mongo-init/01-init-database.js`) automatically creates:
- **2 users**: Tomonthy Pond, Jason Perez
- **4 videos**: Prioritize, Mitigate, Risk Visualize, Proactive

## 🎬 Video Storage

Videos are stored in `/media/videos/` and mounted to the UI container:

```
media/
└── videos/
    ├── Prioritize.mp4
    ├── Mitigate.mp4
    ├── RiskVisualize.mp4
    └── Proactive.mp4
```

Videos are accessible at: `http://localhost:8080/videos/FILENAME.mp4`

## 🔧 Services

### MongoDB
- **Image**: mongo:7
- **Port**: 27017
- **Volume**: `mongodb_data`

### SDK Service
- **Port**: 5050
- **MongoDB URI**: Set via `MONGODB_URI` environment variable

### UI
- **Port**: 8080
- **Videos**: Mounted from `../media/videos/`

## 🧹 Cleanup

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (WARNING: deletes MongoDB data!)
docker compose down -v
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker compose ps

# View MongoDB logs
docker compose logs mongodb

# Connect to MongoDB shell
docker compose exec mongodb mongosh -u admin -p password --authenticationDatabase admin
```

### Missing Videos
```bash
# Check if videos directory is mounted
docker compose exec ui ls -la /usr/share/nginx/html/videos

# Copy videos to media directory
cp /path/to/your/videos/* media/videos/
```

### Re-initialize Database
```bash
# Remove MongoDB volume and restart
docker compose down -v
docker compose up -d mongodb
```

## 📊 MongoDB Usage Examples

### Connect to MongoDB
```bash
docker compose exec mongodb mongosh -u admin -p password --authenticationDatabase admin
```

### Query Videos
```javascript
// List all videos
db.videos.find().pretty()

// Find video by title
db.videos.findOne({ title: "Prioritize" })

// Find all videos by user
db.videos.find({ "uploader.username": "tomonthypond" })
```

### Query Users
```javascript
// List all users
db.users.find().pretty()

// Find user by username
db.users.findOne({ username: "tomonthypond" })
```

## 🎯 Next Steps

1. **Update SDK Service** to use MongoDB for video storage
2. **Add API endpoints** for video CRUD operations
3. **Implement authentication** for user management
4. **Add video upload** functionality
5. **Connect frontend** to MongoDB via SDK API

