import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FiUsers, FiMessageSquare, FiTrendingUp, FiActivity } from 'react-icons/fi'
import { getTopUsers, getTrendingPosts, getAllPosts } from '../api/endpoints'
import LoadingCard from '../components/Common/LoadingCard'
import ErrorCard from '../components/Common/ErrorCard'
import StatsCard from '../components/Dashboard/StatsCard'
import UserEngagementChart from '../components/Dashboard/UserEngagementChart'
import PostActivityTimeline from '../components/Dashboard/PostActivityTimeline'
import PostCard from '../components/Common/PostCard'


function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    engagementRate: 0,
  })
  
  // Fetch top users data
  const { 
    data: topUsers = [],
    isLoading: isTopUsersLoading,
    error: topUsersError,
    refetch: refetchTopUsers
  } = useQuery('topUsers', () => getTopUsers(5), {
    staleTime: 60000, // 1 minute
  })
  
  // Fetch trending posts data
  const { 
    data: trendingPosts = [],
    isLoading: isTrendingPostsLoading,
    error: trendingPostsError,
    refetch: refetchTrendingPosts
  } = useQuery('trendingPosts', () => getTrendingPosts(5), {
    staleTime: 60000, // 1 minute
  })
  
  // Calculate stats when data is loaded
  useEffect(() => {
    // Ensure both arrays exist before calculating stats
    const validTopUsers = Array.isArray(topUsers) ? topUsers : []
    const validTrendingPosts = Array.isArray(trendingPosts) ? trendingPosts : []
    
    const userCount = validTopUsers.length
    const postCount = validTrendingPosts.length
    const commentCount = validTrendingPosts.reduce((count, post) => count + (post.commentCount || 0), 0)
    
    // Calculate engagement rate (comments per post)
    const engagementRate = postCount > 0 ? ((commentCount / postCount) * 100).toFixed(1) : 0
    
    setStats({
      totalUsers: userCount,
      totalPosts: postCount,
      totalComments: commentCount,
      engagementRate,
    })
  }, [topUsers, trendingPosts])
  
  if (isTopUsersLoading || isTrendingPostsLoading) {
    return <LoadingCard height="h-screen" message="Loading dashboard data..." />
  }
  
  if (topUsersError || trendingPostsError) {
    return (
      <ErrorCard 
        error={topUsersError || trendingPostsError} 
        onRetry={() => {
          refetchTopUsers()
          refetchTrendingPosts()
        }} 
      />
    )
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers} 
          change={12} 
          icon={FiUsers} 
          iconBg="bg-primary-500"
        />
        <StatsCard 
          title="Total Posts" 
          value={stats.totalPosts} 
          change={8} 
          icon={FiMessageSquare} 
          iconBg="bg-secondary-500"
        />
        <StatsCard 
          title="Total Comments" 
          value={stats.totalComments} 
          change={24} 
          icon={FiTrendingUp} 
          iconBg="bg-accent-500"
        />
        <StatsCard 
          title="Engagement Rate" 
          value={`${stats.engagementRate}%`} 
          change={4} 
          icon={FiActivity} 
          iconBg="bg-success-500"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UserEngagementChart data={Array.isArray(topUsers) ? topUsers : []} />
        <PostActivityTimeline posts={Array.isArray(trendingPosts) ? trendingPosts : []} />
      </div>
      
      {/* Top Trending Post */}
      {Array.isArray(trendingPosts) && trendingPosts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Top Trending Post</h2>
          <PostCard 
            post={trendingPosts[0]} 
            user={{ id: trendingPosts[0].userid, name: trendingPosts[0].userName || `User ${trendingPosts[0].userid}` }}
            showComments={true}
          />
        </div>
      )}
    </div>
  )
}

export default Dashboard