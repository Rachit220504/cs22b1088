import { useState, useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { FiRefreshCw } from 'react-icons/fi'
import { getUsers } from '../api/endpoints'
import LoadingCard from '../components/Common/LoadingCard'
import ErrorCard from '../components/Common/ErrorCard'
import PostCard from '../components/Common/PostCard'

function Feed() {
  const [refreshing, setRefreshing] = useState(false)
  const [userMap, setUserMap] = useState({})
  const [allPosts, setAllPosts] = useState([])
  const refreshTimeout = useRef(null)
  
  // Fetch all users (subreddits)
  const {
    data: users = [],
    isLoading: isUsersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery('allUsers', getUsers, {
    staleTime: 60000, // 1 minute
  })
  
  // Create a user map for easy lookup
  useEffect(() => {
    if (Array.isArray(users)) {
      const map = {}
      users.forEach(user => {
        if (user && user.id) {
          map[user.id] = user
        }
      })
      setUserMap(map)
    } else {
      setUserMap({})
    }
  }, [users])
  
  // Fetch posts for each user (subreddit)
  const { 
    isLoading: isPostsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useQuery(['allPosts', users], async () => {
    if (!Array.isArray(users) || users.length === 0) return []
    
    // For performance, only fetch posts from the first 5 subreddits
    const userSample = users.slice(0, 5)
    
    // Import dynamically to prevent circular dependencies
    const { getUserPosts } = await import('../api/endpoints')
    
    // Fetch posts for each subreddit
    const postsPromises = userSample.map(user => 
      getUserPosts(user.id, 4).catch(err => {
        console.error(`Error fetching posts for ${user.name}:`, err)
        return [] // Return empty array on error
      })
    )
    
    const postsArrays = await Promise.all(postsPromises)
    const combinedPosts = postsArrays.flat()
    
    // Update state with the fetched posts
    setAllPosts(combinedPosts)
    return combinedPosts
  }, {
    staleTime: 30000, // 30 seconds
    enabled: users.length > 0
  })
  
  // Handle refresh action
  const handleRefresh = async () => {
    if (refreshing) return
    
    setRefreshing(true)
    
    try {
      await refetchUsers()
      await refetchPosts()
    } catch (error) {
      console.error('Error refreshing feed:', error)
    }
    
    // Set a minimum loading time for better UX
    refreshTimeout.current = setTimeout(() => {
      setRefreshing(false)
    }, 800)
    
    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current)
      }
    }
  }
  
  if (isPostsLoading || isUsersLoading) {
    return <LoadingCard height="h-screen" message="Loading feed..." />
  }
  
  if (postsError || usersError) {
    return <ErrorCard error={postsError || usersError} onRetry={handleRefresh} />
  }
  
  // Sort posts by creation date in descending order (newest first)
  const sortedPosts = [...allPosts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Reddit Feed</h1>
          <p className="text-neutral-500 mt-1">Latest posts from popular subreddits</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`btn ${refreshing ? 'btn-secondary' : 'btn-primary'}`}
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>
      
      {/* Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {sortedPosts.map(post => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                // Map Reddit fields to your original structure if needed
                userid: post.userId,
                upvotes: post.likes,
                commentCount: post.comments
              }}
              user={userMap[post.userId] || { 
                id: post.userId, 
                name: post.username || `r/${post.subreddit}` 
              }}
            />
          ))}
          
          {sortedPosts.length === 0 && (
            <div className="card h-64 flex items-center justify-center">
              <p className="text-neutral-500">No posts available</p>
            </div>
          )}
        </div>
        
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <div className="card mb-6">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">About Reddit Feed</h3>
              <p className="text-neutral-600 mb-4">
                This feed displays the latest posts from popular subreddits in real-time.
                Content is pulled directly from Reddit.
              </p>
              <div className="bg-primary-50 p-4 rounded-md border border-primary-100">
                <h4 className="text-sm font-semibold text-primary-800 mb-2">Refresh Tip</h4>
                <p className="text-sm text-primary-700">
                  Click the refresh button to fetch the latest posts and keep your feed up to date.
                </p>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Active Subreddits</h3>
              <div className="space-y-4">
                {Array.isArray(users) && users.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.split(' ').join('+')}&background=3B82F6&color=fff&size=32`}
                      alt={`${user.name}'s avatar`}
                      className="h-8 w-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                      <div className="flex items-center mt-1">
                        <span className="h-2 w-2 rounded-full bg-success-500 mr-2"></span>
                        <span className="text-xs text-neutral-500">{user.followers} members</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed