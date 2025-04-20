// Generate a consistent avatar for a user based on their ID
export const generateUserAvatar = (userId, size = 100) => {
  const colors = [
    'ff6b6b', 'ff8e53', 'ffda83', '6bff72', '6bceff', 'a06bff', 'ff6bd5',
    '4ecdc4', 'f7fff7', 'ff6b6b', 'ffe66d', '1a535c', '4ecdc4', 'f7fff7',
  ]
  
  // Use the userId to determine a consistent color
  const colorIndex = parseInt(userId) % colors.length
  const backgroundColor = colors[colorIndex]
  
  // Create initials from user ID (for demo purposes)
  const initials = `U${userId}`
  
  return `https://ui-avatars.com/api/?name=${initials}&background=${backgroundColor}&color=fff&size=${size}`
}

// Generate a random image for a post based on post ID and content
export const generatePostImage = (postId, content, width = 800, height = 600) => {
  // Extract a keyword from the content if possible
  const contentWords = content?.split(' ') || []
  const keywordCandidates = contentWords.filter(word => word.length > 3)
  const keyword = keywordCandidates.length > 0 
    ? keywordCandidates[postId % keywordCandidates.length] 
    : 'abstract'
  
  return `https://source.unsplash.com/random/${width}x${height}/?${keyword}`
}

// Format time as "X time ago"
export const timeAgo = (timestamp) => {
  const now = new Date()
  const past = new Date(timestamp)
  const seconds = Math.floor((now - past) / 1000)
  
  // We don't have real timestamps in our API, so we'll simulate time ago
  // based on the IDs (higher IDs are newer)
  const simulatedSeconds = 10000000 - timestamp
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(simulatedSeconds / secondsInUnit)
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`
    }
  }
  
  return 'just now'
}

// Generate a random number for engagement metrics
export const randomEngagement = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}