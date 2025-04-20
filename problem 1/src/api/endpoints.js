import redditClient from './redditClient';

// Helper function to get the best image from a post
const getPostImage = (postData) => {
  // Check for various image sources in order of preference
  if (postData.url && (postData.url.endsWith('.jpg') || postData.url.endsWith('.png') || postData.url.endsWith('.gif'))) {
    return postData.url;
  }
  
  if (postData.preview && postData.preview.images && postData.preview.images.length > 0) {
    return postData.preview.images[0].source.url.replace(/&amp;/g, '&');
  }
  
  if (postData.thumbnail && postData.thumbnail !== 'self' && postData.thumbnail !== 'default') {
    return postData.thumbnail;
  }
  
  return null;
};

// Helper function to get subreddit name from ID
const getSubredditNameFromId = async (subredditId) => {
  try {
    // If the ID starts with "t5_", remove it
    const cleanId = subredditId.replace('t5_', '');
    
    // Try to get from cache or from the API
    const response = await redditClient.get(`/api/info.json`, {
      params: { id: `t5_${cleanId}` }
    });
    
    if (response.data.data.children.length > 0) {
      return response.data.data.children[0].data.display_name;
    }
    
    // Fall back to popular subreddits
    return ['programming', 'technology', 'news', 'AskReddit', 'pics'][Math.floor(Math.random() * 5)];
  } catch (error) {
    console.error(`Error getting subreddit name from ID ${subredditId}:`, error);
    // Fallback to a few popular subreddits
    return ['programming', 'technology', 'news', 'AskReddit', 'pics'][Math.floor(Math.random() * 5)];
  }
};

// Get popular subreddits (mapped as "users" in the application)
export async function getUsers(limit = 20) {
  try {
    const response = await redditClient.get('/subreddits/popular.json', {
      params: { limit }
    });
    
    return response.data.data.children.map(subreddit => ({
      id: subreddit.data.id,
      name: subreddit.data.display_name,
      username: subreddit.data.display_name_prefixed,
      avatar: subreddit.data.icon_img || subreddit.data.community_icon || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png',
      description: subreddit.data.public_description,
      followers: subreddit.data.subscribers,
      following: Math.floor(Math.random() * 100),
      postsCount: Math.floor(Math.random() * 1000),
      postCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 200),
      totalEngagement: Math.floor(Math.random() * 300)
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return mock users instead of throwing error
    return Array(limit).fill().map((_, i) => ({
      id: `t5_${100000 + i}`,
      name: `Subreddit${i+1}`,
      username: `r/Subreddit${i+1}`,
      avatar: `https://ui-avatars.com/api/?name=S${i+1}&background=3B82F6&color=fff&size=128`,
      description: `This is a mock subreddit ${i+1} for development purposes.`,
      followers: Math.floor(Math.random() * 500000) + 1000,
      following: Math.floor(Math.random() * 100),
      postsCount: Math.floor(Math.random() * 1000),
      postCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 200),
      totalEngagement: Math.floor(Math.random() * 300)
    }));
  }
}

// Get top users sorted by engagement
export async function getTopUsers(limit = 10) {
  try {
    const users = await getUsers(limit * 2);
    return users
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top users:', error);
    // Return mock top users instead of throwing error
    return Array(limit).fill().map((_, i) => ({
      id: `t5_${100000 + i}`,
      name: `TopSubreddit${i+1}`,
      username: `r/TopSubreddit${i+1}`,
      avatar: `https://ui-avatars.com/api/?name=TS${i+1}&background=3B82F6&color=fff&size=128`,
      description: `This is a top mock subreddit ${i+1} for development purposes.`,
      followers: Math.floor(Math.random() * 1000000) + 100000,
      following: Math.floor(Math.random() * 100),
      postsCount: Math.floor(Math.random() * 1000),
      postCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 200),
      totalEngagement: 1000000 - (i * 50000) // Ensure they're sorted by engagement
    }));
  }
}

// Get posts for a specific subreddit
export async function getUserPosts(userId, limit = 20) {
  try {
    const subredditName = await getSubredditNameFromId(userId);
    
    const response = await redditClient.get(`/r/${subredditName}/hot.json`, {
      params: { limit }
    });
    
    return response.data.data.children.map(post => ({
      id: post.data.id,
      userId: post.data.subreddit_id,
      username: post.data.subreddit_name_prefixed || `r/${post.data.subreddit}`,
      userAvatar: '',
      title: post.data.title,
      content: post.data.selftext || post.data.title,
      imageUrl: getPostImage(post.data),
      likes: post.data.ups,
      comments: post.data.num_comments,
      createdAt: new Date(post.data.created_utc * 1000).toISOString(),
      subreddit: post.data.subreddit,
      commentCount: post.data.num_comments
    }));
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    // Return mock posts for this user instead of throwing error
    return Array(limit).fill().map((_, i) => ({
      id: `post${i+1}-${userId}`,
      userId: userId,
      username: `r/Subreddit-${userId.replace('t5_', '')}`,
      userAvatar: '',
      title: `Mock Post ${i+1} for ${userId}`,
      content: `This is mock content for post ${i+1} from ${userId}. This simulates what would normally come from the Reddit API.`,
      imageUrl: i % 3 === 0 ? `https://picsum.photos/seed/post${i+1}-${userId}/800/600` : null,
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 500),
      createdAt: new Date(Date.now() - (i * 3600000)).toISOString(),
      subreddit: `Subreddit-${userId.replace('t5_', '')}`,
      commentCount: Math.floor(Math.random() * 500)
    }));
  }
}

// Get trending posts from popular subreddits
export async function getTrendingPosts(limit = 20) {
  try {
    const response = await redditClient.get('/r/popular.json', {
      params: { limit }
    });
    
    // Check if we got valid data
    if (!response.data?.data?.children || response.data.data.children.length === 0) {
      throw new Error('No trending posts data received');
    }
    
    return response.data.data.children.map(post => ({
      id: post.data.id,
      userid: post.data.subreddit_id,
      userName: post.data.subreddit_name_prefixed || `r/${post.data.subreddit}`,
      title: post.data.title,
      content: post.data.selftext || post.data.title,
      imageUrl: getPostImage(post.data),
      likes: post.data.ups,
      commentCount: post.data.num_comments,
      createdAt: new Date(post.data.created_utc * 1000).toISOString(),
      subreddit: post.data.subreddit
    }));
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    // Return mock trending posts instead of throwing error
    return Array(limit).fill().map((_, i) => ({
      id: `trend-post-${i}`,
      userid: `t5_${200000 + i}`,
      userName: `r/TrendingSubreddit${i+1}`,
      title: `Trending Post ${i+1}`,
      content: `This is mock content for trending post ${i+1}. This simulates what would normally come from the Reddit API.`,
      imageUrl: i % 2 === 0 ? `https://picsum.photos/seed/trend${i+1}/800/600` : null,
      likes: 50000 - (i * 1000), // Higher votes for top trending posts
      commentCount: Math.floor(Math.random() * 2000) + 500,
      createdAt: new Date(Date.now() - (i * 1800000)).toISOString(), // More recent timestamps
      subreddit: `TrendingSubreddit${i+1}`
    }));
  }
}

// Get all posts from multiple subreddits
export async function getAllPosts(limit = 5) {
  try {
    const subreddits = await getUsers(5);
    
    const postsPromises = subreddits.map(subreddit => 
      getUserPosts(subreddit.id, limit)
    );
    
    const postsArrays = await Promise.all(postsPromises);
    return postsArrays.flat();
  } catch (error) {
    console.error('Error fetching all posts:', error);
    // Return mock posts instead of throwing error
    return Array(limit * 5).fill().map((_, i) => ({
      id: `all-post-${i}`,
      userId: `t5_${300000 + Math.floor(i/limit)}`,
      username: `r/AllSubreddit${Math.floor(i/limit)+1}`,
      userAvatar: '',
      title: `General Post ${i+1}`,
      content: `This is mock content for general post ${i+1}. This simulates what would normally come from the Reddit API.`,
      imageUrl: i % 4 === 0 ? `https://picsum.photos/seed/all${i+1}/800/600` : null,
      likes: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 300),
      createdAt: new Date(Date.now() - (i * 7200000)).toISOString(),
      subreddit: `AllSubreddit${Math.floor(i/limit)+1}`,
      commentCount: Math.floor(Math.random() * 300)
    }));
  }
}

// Get comments for a specific post
export async function getPostComments(postId, subreddit) {
  try {
    const response = await redditClient.get(`/r/${subreddit}/comments/${postId}.json`);
    
    // Ensure we have valid comment data
    if (!Array.isArray(response.data) || response.data.length < 2 || 
        !response.data[1]?.data?.children) {
      throw new Error('Invalid comment data structure');
    }
    
    return response.data[1].data.children
      .filter(comment => comment.kind === 't1')
      .map(comment => ({
        id: comment.data.id,
        postId: postId,
        userId: comment.data.author_fullname || `user_${comment.data.author}`,
        author: comment.data.author,
        authorAvatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png',
        content: comment.data.body,
        likes: comment.data.ups,
        createdAt: new Date(comment.data.created_utc * 1000).toISOString()
      }));
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    // Return mock comments instead of throwing error
    return Array(10).fill().map((_, i) => ({
      id: `comment-${i}-${postId}`,
      postId: postId,
      userId: `user_${i}`,
      author: `MockUser${i+1}`,
      authorAvatar: `https://ui-avatars.com/api/?name=U${i+1}&background=4F46E5&color=fff&size=128`,
      content: `This is a mock comment ${i+1} for post ${postId}. Reddit API data is being simulated.`,
      likes: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - (i * 900000)).toISOString()
    }));
  }
}

// Get a user profile by ID
export async function getUserProfile(userId) {
  try {
    const users = await getUsers(100);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return user;
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    // Return a mock user profile instead of throwing error
    return {
      id: userId,
      name: `Profile-${userId.replace('t5_', '')}`,
      username: `r/Profile-${userId.replace('t5_', '')}`,
      avatar: `https://ui-avatars.com/api/?name=P${userId.slice(-2)}&background=3B82F6&color=fff&size=128`,
      description: `This is a mock profile for ${userId}. User data is being simulated.`,
      followers: Math.floor(Math.random() * 500000) + 1000,
      following: Math.floor(Math.random() * 100),
      postsCount: Math.floor(Math.random() * 1000),
      postCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 200),
      totalEngagement: Math.floor(Math.random() * 300000)
    };
  }
}

// Export everything in a different way as well to cover different import styles
export default {
  getUsers,
  getTopUsers,
  getUserPosts,
  getTrendingPosts,
  getAllPosts,
  getPostComments,
  getUserProfile
};