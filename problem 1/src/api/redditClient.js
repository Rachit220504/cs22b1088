import axios from 'axios';

// Creating a Reddit API client with CORS proxy
const redditClient = axios.create({
  // Use a more reliable CORS proxy
  baseURL: 'https://corsproxy.io/?https://www.reddit.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'web:socialmedia-analytics:v1.0 (by /u/Jealous_Skill_589)'
  }
});

// Add request interceptor to log requests
redditClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Improved response interceptor with better error handling
redditClient.interceptors.response.use(
  (response) => {
    console.log('Received response from Reddit API', response.config.url);
    
    // Add image URLs to posts for better display
    if (response.data && response.data.data && response.data.data.children) {
      response.data.data.children = response.data.data.children.map(child => {
        if (child.data) {
          // Extract image URL from various Reddit post types
          let imageUrl = null;
          
          // Check for direct image links
          if (child.data.url && /\.(jpg|jpeg|png|gif)$/i.test(child.data.url)) {
            imageUrl = child.data.url;
          }
          // Check for thumbnail
          else if (child.data.thumbnail && child.data.thumbnail !== 'self' && child.data.thumbnail !== 'default') {
            imageUrl = child.data.thumbnail;
          }
          // Check for image previews
          else if (child.data.preview && child.data.preview.images && child.data.preview.images[0]) {
            const preview = child.data.preview.images[0];
            imageUrl = preview.source.url.replace(/&amp;/g, '&');
          }
          
          child.data.imageUrl = imageUrl;
          
          // Add content field for compatibility with our app
          child.data.content = child.data.selftext || child.data.title;
        }
        return child;
      });
    }
    
    return response;
  },
  (error) => {
    console.error('Reddit API Error:', error.message);
    console.log('Failed URL:', error.config?.url);
    
    // Log more details about the error
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response headers:', error.response.headers);
      console.log('Response data:', error.response.data);
    }
    
    // Instead of failing completely, return a resolved promise with mockData
    console.log('Falling back to mock data');
    return Promise.resolve({ 
      data: getMockDataForEndpoint(error.config?.url || '')
    });
  }
);

// Enhanced mock data generator based on the endpoint being called
function getMockDataForEndpoint(url) {
  console.log('Generating mock data for:', url);
  
  if (url.includes('subreddits/popular')) {
    return mockSubreddits();
  } else if (url.includes('/hot.json') || url.includes('/r/popular.json')) {
    return mockPosts();
  } else if (url.includes('/comments/')) {
    return mockComments();
  }
  return { data: { children: [] } };
}

// Mock subreddits data
function mockSubreddits() {
  return {
    data: {
      children: Array(20).fill().map((_, i) => ({
        data: {
          id: `t5_${100000 + i}`,
          display_name: `Subreddit${i+1}`,
          display_name_prefixed: `r/Subreddit${i+1}`,
          public_description: `This is a mock subreddit ${i+1} for development purposes.`,
          subscribers: Math.floor(Math.random() * 500000) + 1000,
          icon_img: `https://ui-avatars.com/api/?name=S${i+1}&background=3B82F6&color=fff&size=128`
        }
      }))
    }
  };
}

// Improved mock posts data with image URLs
function mockPosts() {
  return {
    data: {
      children: Array(20).fill().map((_, i) => ({
        data: {
          id: `post${i+1}`,
          title: `Mock Post ${i+1}`,
          selftext: `This is mock content for post ${i+1}. This simulates what would normally come from the Reddit API.`,
          content: `This is mock content for post ${i+1}. This simulates what would normally come from the Reddit API.`,
          subreddit: `Subreddit${(i % 5) + 1}`,
          subreddit_id: `t5_${100000 + (i % 5)}`,
          subreddit_name_prefixed: `r/Subreddit${(i % 5) + 1}`,
          ups: Math.floor(Math.random() * 10000),
          num_comments: Math.floor(Math.random() * 500),
          created_utc: (Date.now() / 1000) - (i * 3600),
          // Add image URL for each post using Picsum Photos with consistent seed
          imageUrl: `https://picsum.photos/seed/mockpost${i+1}/800/600`
        }
      }))
    }
  };
}

// Mock comments data
function mockComments() {
  return [
    { data: { children: [] } }, // First element is post data
    {
      data: {
        children: Array(10).fill().map((_, i) => ({
          kind: 't1',
          data: {
            id: `comment${i+1}`,
            author: `User${i+1}`,
            body: `This is a mock comment ${i+1}. Reddit API isn't directly accessible from browsers.`,
            ups: Math.floor(Math.random() * 100),
            created_utc: (Date.now() / 1000) - (i * 600)
          }
        }))
      }
    }
  ];
}

export default redditClient;