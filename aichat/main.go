package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type ChatRequest struct {
	Message         string `json:"message"`
	SecurityEnabled *bool  `json:"securityEnabled,omitempty"`
}

type AIGuardConfig struct {
	APIKey string
	Base   string
}

// OllamaRequest includes Stream:true
type OllamaRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

type OllamaResponse struct {
	Response string `json:"response"`
	Done     bool   `json:"done"`
}

func initAIGuard() *AIGuardConfig {
	apiKey := os.Getenv("API_KEY")
	if apiKey == "" {
		fmt.Fprintln(os.Stderr, "Warning: API_KEY not set; guard checks will be skipped")
	}
	return &AIGuardConfig{
		APIKey: apiKey,
		Base:   "https://api.xdr.trendmicro.com/beta/aiSecurity",
	}
}

// getModelName returns the model to use, with fallback to smaller models
func getModelName() string {
	// Check for environment variable first
	if model := os.Getenv("OLLAMA_MODEL"); model != "" {
		return model
	}

	// Default to a smaller, efficient model
	// Options in order of preference (smallest to largest):
	// - tinyllama:1.1b-chat: ~1.1GB, fast, good for chat
	// - phi:2.7b: ~1.7GB, good balance
	// - phi:latest: ~2.7GB, original choice
	return "tinyllama:1.1b-chat"
}

// checkAIGuard POSTs to TrendVisionOne, logs and returns true if action=="Block"
func checkAIGuard(label, content string, cfg *AIGuardConfig) (bool, error) {
	fmt.Printf("[VisionOne] checking %s: %q\n", label, content)
	if cfg.APIKey == "" {
		fmt.Println("[VisionOne] no API key; skipping guard")
		return false, nil
	}

	url := cfg.Base + "/guard?detailedResponse=false"
	payload, _ := json.Marshal(map[string]string{"guard": content})
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return false, err
	}
	req.Header.Set("Authorization", "Bearer "+cfg.APIKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return false, err
	}
	defer res.Body.Close()

	fmt.Printf("[VisionOne] HTTP %d %s\n", res.StatusCode, res.Status)
	body, _ := io.ReadAll(res.Body)
	fmt.Printf("[VisionOne] raw body: %s\n", body)

	var gr struct {
		Action string `json:"action"`
		Reason string `json:"reason"`
	}
	if err := json.Unmarshal(body, &gr); err != nil {
		return false, err
	}
	fmt.Printf("[VisionOne] action: %s; reason: %s\n", gr.Action, gr.Reason)

	return strings.EqualFold(gr.Action, "Block"), nil
}

func pullModel() error {
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	pullURL := ollamaURL + "/api/pull"

	modelName := getModelName()
	fmt.Printf("[Ollama] Pulling model: %s\n", modelName)

	reqBody, _ := json.Marshal(map[string]string{"name": modelName})
	res, err := http.Post(pullURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return err
	}
	defer res.Body.Close()
	io.Copy(os.Stdout, res.Body)
	return nil
}

func handleHealth(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "healthy", "service": "aichat"})
}

func handleChat(c echo.Context, guardCfg *AIGuardConfig) error {
	var req ChatRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"response": "Invalid request"})
	}

	// Check if security is enabled (default to true if not specified)
	securityEnabled := true
	if req.SecurityEnabled != nil {
		securityEnabled = *req.SecurityEnabled
	}

	// 1) Guard the **prompt** only (if security is enabled)
	if securityEnabled {
		if blocked, err := checkAIGuard("prompt", req.Message, guardCfg); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Error checking policy"})
		} else if blocked {
			return c.JSON(http.StatusForbidden, map[string]string{"response": "Blocked: Trend Vision One"})
		}
	}

	// 2) Call Ollama with streaming enabled
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	genURL := ollamaURL + "/api/generate"

	modelName := getModelName()
	ollReq := OllamaRequest{
		Model:  modelName,
		Prompt: fmt.Sprintf("You are a helpful assistant for the Boring Media Co. %s", req.Message),
		Stream: true,
	}
	reqBody, _ := json.Marshal(ollReq)
	res, err := http.Post(genURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Failed to call LLM"})
	}
	defer res.Body.Close()

	// 3) Assemble streamed chunks
	var replyBuilder strings.Builder
	scanner := bufio.NewScanner(res.Body)
	for scanner.Scan() {
		var chunk OllamaResponse
		if err := json.Unmarshal(scanner.Bytes(), &chunk); err != nil {
			continue
		}
		replyBuilder.WriteString(chunk.Response)
		if chunk.Done {
			break
		}
	}
	if err := scanner.Err(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Error reading LLM response"})
	}

	// 4) Guard the **response** as well (if security is enabled)
	response := replyBuilder.String()
	if securityEnabled {
		if blocked, err := checkAIGuard("response", response, guardCfg); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Error checking policy"})
		} else if blocked {
			return c.JSON(http.StatusForbidden, map[string]string{"response": "Blocked: Trend Vision One"})
		}
	}

	// 5) Return the allowed reply
	return c.JSON(http.StatusOK, map[string]string{"response": response})
}

func handleRecommend(c echo.Context, guardCfg *AIGuardConfig) error {
	// Fetch videos from SDK service
	sdkURL := os.Getenv("SDK_URL")
	if sdkURL == "" {
		sdkURL = "http://sdk-service:5000"
	}

	// Get all videos
	resp, err := http.Get(sdkURL + "/videos")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch videos from SDK"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to read SDK response"})
	}

	// Parse videos
	var videos []map[string]interface{}
	if err := json.Unmarshal(body, &videos); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to parse videos"})
	}

	if len(videos) == 0 {
		return c.JSON(http.StatusOK, map[string]interface{}{"recommendedVideo": nil, "message": "No videos available"})
	}

	// FAST PATH: Use deterministic engagement-based recommendation (instant response)
	// This is much faster than waiting for AI, especially on Mac
	var bestVideo map[string]interface{}
	var bestScore float64 = 0
	
	for _, v := range videos {
		views, _ := v["views"].(float64)
		likes, _ := v["likes"].(float64)
		dislikes, _ := v["dislikes"].(float64)
		
		// Simple engagement score: (views * likes) / dislikes ratio
		score := views * (likes / float64(likes+dislikes+1)) 
		if score > bestScore {
			bestScore = score
			bestVideo = v
		}
	}
	
	if bestVideo != nil {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"recommendedVideo": bestVideo,
			"aiReasoning":       fmt.Sprintf("Recommended based on engagement score: %.0f", bestScore),
			"method":            "engagement-based",
		})
	}

	// Create a summary of videos for the LLM
	var videoSummary strings.Builder
	videoSummary.WriteString("Available videos for recommendation:\n\n")
	for i, v := range videos {
		title, _ := v["title"].(string)
		desc, _ := v["description"].(string)
		views, _ := v["views"].(float64)
		likes, _ := v["likes"].(float64)
		
		// Handle different MongoDB _id formats
		var idStr string
		switch idVal := v["_id"].(type) {
		case string:
			idStr = idVal
		case map[string]interface{}:
			if oid, ok := idVal["$oid"].(string); ok {
				idStr = oid
			} else {
				idStr = fmt.Sprintf("%v", idVal)
			}
		default:
			idStr = fmt.Sprintf("%v", idVal)
		}

		videoSummary.WriteString(fmt.Sprintf("Video %d:\n", i+1))
		videoSummary.WriteString(fmt.Sprintf("  ID: %s\n", idStr))
		videoSummary.WriteString(fmt.Sprintf("  Title: %s\n", title))
		videoSummary.WriteString(fmt.Sprintf("  Description: %s\n", desc))
		videoSummary.WriteString(fmt.Sprintf("  Views: %.0f, Likes: %.0f\n", views, likes))
		videoSummary.WriteString("\n")
	}

	videoSummary.WriteString("\nBased on today's context (user engagement, relevance, quality), recommend the single best video from the list above. Respond with ONLY the video ID number (e.g., '3'), nothing else. Be quick and concise.")

	// Call Ollama to get recommendation
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	genURL := ollamaURL + "/api/generate"

	modelName := getModelName()
	
	// Simple prompt for faster response
	shortPrompt := "You are an AI recommendation assistant. Pick the BEST video from this list by engagement (views × likes ratio). Respond with ONLY the video number (1-9).\n\n" + videoSummary.String()
	
	ollReq := OllamaRequest{
		Model:  modelName,
		Prompt: fmt.Sprintf("You are an AI recommendation assistant for Boring Media Co, a video streaming platform. Your task is to recommend the best video of the day.\n\n%s", shortPrompt),
		Stream: true,
	}
	reqBody, _ := json.Marshal(ollReq)
	res, err := http.Post(genURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to call LLM"})
	}
	defer res.Body.Close()

	// Parse response
	var recommendation strings.Builder
	scanner := bufio.NewScanner(res.Body)
	for scanner.Scan() {
		var chunk OllamaResponse
		if err := json.Unmarshal(scanner.Bytes(), &chunk); err != nil {
			continue
		}
		recommendation.WriteString(chunk.Response)
		if chunk.Done {
			break
		}
	}

	// Extract video ID from recommendation
	recStr := strings.TrimSpace(recommendation.String())
	// Try to find a number in the response
	var recommendedVideo map[string]interface{}
	recStr = strings.ToLower(recStr)
	
	// Quick fallback: Pick the video with highest engagement score (views * likes ratio)
	if recommendedVideo == nil {
		var bestScore float64 = 0
		for _, v := range videos {
			views, _ := v["views"].(float64)
			likes, _ := v["likes"].(float64)
			score := views * (likes / 100.0) // Normalized engagement score
			if score > bestScore {
				bestScore = score
				recommendedVideo = v
			}
		}
	}
	
	// Try AI recommendation
	for i, v := range videos {
		if strings.Contains(recStr, fmt.Sprintf("%d", i+1)) || strings.Contains(recStr, fmt.Sprintf("video %d", i+1)) {
			recommendedVideo = v
			break
		}
	}

	// If no match found, just pick the first video
	if recommendedVideo == nil && len(videos) > 0 {
		recommendedVideo = videos[0]
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"recommendedVideo": recommendedVideo,
		"aiReasoning":      recommendation.String(),
	})
}

func handleSemanticSearch(c echo.Context) error {
	var req struct {
		Query string `json:"query"`
	}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	// Fetch videos from SDK
	sdkURL := os.Getenv("SDK_URL")
	if sdkURL == "" {
		sdkURL = "http://sdk-service:5000"
	}

	resp, err := http.Get(sdkURL + "/videos")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch videos"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to read response"})
	}

	var videos []map[string]interface{}
	if err := json.Unmarshal(body, &videos); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to parse videos"})
	}

	// Simple relevance matching based on query keywords
	// In production, use semantic search with embeddings
	queryLower := strings.ToLower(req.Query)
	var matchingVideos []map[string]interface{}

	for _, v := range videos {
		title, _ := v["title"].(string)
		desc, _ := v["description"].(string)
		category, _ := v["category"].(string)
		tags, _ := v["tags"].([]interface{})

		if strings.Contains(strings.ToLower(title), queryLower) ||
			strings.Contains(strings.ToLower(desc), queryLower) ||
			strings.Contains(strings.ToLower(category), queryLower) {
			matchingVideos = append(matchingVideos, v)
		} else if tags != nil {
			for _, tag := range tags {
				if tagStr, ok := tag.(string); ok && strings.Contains(strings.ToLower(tagStr), queryLower) {
					matchingVideos = append(matchingVideos, v)
					break
				}
			}
		}
	}

	return c.JSON(http.StatusOK, matchingVideos)
}

func main() {
	guardCfg := initAIGuard()
	if err := pullModel(); err != nil {
		fmt.Fprintf(os.Stderr, "pullModel error: %v\n", err)
	}

	e := echo.New()
	e.Use(middleware.Logger(), middleware.Recover(), middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://ui-service", "http://ollama-service", "http://localhost:8080", "http://localhost:5001", "http://localhost", "https://localhost"},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: false,
		MaxAge:           86400,
	}))

	e.GET("/health", handleHealth)
	e.POST("/chat", func(c echo.Context) error {
		return handleChat(c, guardCfg)
	})
	e.GET("/recommend", func(c echo.Context) error {
		return handleRecommend(c, guardCfg)
	})
	e.POST("/search", func(c echo.Context) error {
		return handleSemanticSearch(c)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "5001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}