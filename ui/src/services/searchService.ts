// AI-Powered Search Service for Boring Media Co
import type { Video } from './api';

export interface SearchSuggestion {
  type: 'video' | 'query' | 'category';
  title: string;
  subtitle?: string;
  category?: string;
}

export const searchService = {
  // AI-enhanced search that returns videos matching the query
  async search(query: string): Promise<Video[]> {
    try {
      // Call AI service to get semantic search results
      const response = await fetch('/api/aichat/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        return this.fallbackSearch(query);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI search failed, using fallback:', error);
      return this.fallbackSearch(query);
    }
  },

  // Fallback to basic keyword search
  fallbackSearch(_query: string): Video[] {
    // This would search your video database
    return [];
  },

  // Get AI-powered search suggestions as user types
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query) return [];
    
    try {
      const response = await fetch('/api/aichat/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) return [];
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  },
};

export default searchService;

