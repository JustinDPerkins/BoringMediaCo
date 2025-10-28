package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client
var db *mongo.Database

// Video represents a video document in MongoDB
type Video struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	Uploader    UploaderInfo       `json:"uploader" bson:"uploader"`
	VideoURL    string             `json:"videoUrl" bson:"videoUrl"`
	ThumbnailURL string            `json:"thumbnailUrl" bson:"thumbnailUrl"`
	Duration    int                `json:"duration" bson:"duration"`
	Category    string             `json:"category" bson:"category"`
	Views       int                `json:"views" bson:"views"`
	Likes       int                `json:"likes" bson:"likes"`
	Dislikes    int                `json:"dislikes" bson:"dislikes"`
	UploadDate  time.Time          `json:"uploadDate" bson:"uploadDate"`
	Tags        []string           `json:"tags" bson:"tags"`
	Comments    []Comment          `json:"comments" bson:"comments"`
}

// UploaderInfo represents the uploader information embedded in videos
type UploaderInfo struct {
	ID       string `json:"id" bson:"id"`
	Name     string `json:"name" bson:"name"`
	Username string `json:"username" bson:"username"`
	Avatar   string `json:"avatar" bson:"avatar"`
}

// Comment represents a comment on a video
type Comment struct {
	ID      string    `json:"id" bson:"id"`
	Author  string    `json:"author" bson:"author"`
	AuthorAvatar string `json:"authorAvatar" bson:"authorAvatar"`
	Text    string    `json:"text" bson:"text"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
	Likes   int       `json:"likes" bson:"likes"`
}

// User represents a user document in MongoDB
type User struct {
	ID           primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username     string             `json:"username" bson:"username"`
	Name         string             `json:"name" bson:"name"`
	Email        string             `json:"email" bson:"email"`
	Avatar       string             `json:"avatar" bson:"avatar"`
	Bio          string             `json:"bio" bson:"bio"`
	Subscribers  int                `json:"subscribers" bson:"subscribers"`
	TotalVideos  int                `json:"totalVideos" bson:"totalVideos"`
	TotalViews   int                `json:"totalViews" bson:"totalViews"`
	JoinDate     time.Time          `json:"joinDate" bson:"joinDate"`
	Subscriptions []string          `json:"subscriptions" bson:"subscriptions"`
}

// Initialize MongoDB connection
func initMongoDB() {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://admin:password@mongodb:27017/boringmedia?authSource=admin"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Printf("Failed to connect to MongoDB: %v", err)
		return
	}

	// Test connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Printf("Failed to ping MongoDB: %v", err)
		return
	}

	mongoClient = client
	db = client.Database("boringmedia")
	log.Println("✅ Connected to MongoDB successfully")
}

// Get all videos from MongoDB
func getAllVideos(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Collection("videos")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Failed to query videos: %v", err)
		http.Error(w, "Failed to fetch videos", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var videos []Video
	if err = cursor.All(ctx, &videos); err != nil {
		log.Printf("Failed to decode videos: %v", err)
		http.Error(w, "Failed to decode videos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(videos)
}

// Get a specific video by ID
func getVideoByID(w http.ResponseWriter, r *http.Request, id string) {
	setCORSHeaders(w, r)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid video ID", http.StatusBadRequest)
		return
	}

	collection := db.Collection("videos")
	var video Video
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&video)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Video not found", http.StatusNotFound)
		} else {
			log.Printf("Failed to find video: %v", err)
			http.Error(w, "Failed to find video", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(video)
}

// Get all users from MongoDB
func getAllUsers(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w, r)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Collection("users")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Failed to query users: %v", err)
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var users []User
	if err = cursor.All(ctx, &users); err != nil {
		log.Printf("Failed to decode users: %v", err)
		http.Error(w, "Failed to decode users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// Get a specific user by username
func getUserByUsername(w http.ResponseWriter, r *http.Request, username string) {
	setCORSHeaders(w, r)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Collection("users")
	var user User
	err := collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			log.Printf("Failed to find user: %v", err)
			http.Error(w, "Failed to find user", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// Get videos by user ID
func getVideosByUser(w http.ResponseWriter, r *http.Request, userID string) {
	setCORSHeaders(w, r)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Collection("videos")
	cursor, err := collection.Find(ctx, bson.M{"uploader.id": userID})
	if err != nil {
		log.Printf("Failed to query videos: %v", err)
		http.Error(w, "Failed to fetch videos", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var videos []Video
	if err = cursor.All(ctx, &videos); err != nil {
		log.Printf("Failed to decode videos: %v", err)
		http.Error(w, "Failed to decode videos", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(videos)
}

// Increment video views
func incrementVideoViews(w http.ResponseWriter, r *http.Request, id string) {
	setCORSHeaders(w, r)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid video ID", http.StatusBadRequest)
		return
	}

	collection := db.Collection("videos")
	result, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$inc": bson.M{"views": 1}},
	)
	if err != nil {
		log.Printf("Failed to increment views: %v", err)
		http.Error(w, "Failed to increment views", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Video not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Views incremented",
	})
}

