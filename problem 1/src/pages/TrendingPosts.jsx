import { useState } from 'react'
import { useQuery } from 'react-query'
import { FiFilter, FiArrowUp, FiArrowDown, FiSearch } from 'react-icons/fi'
import { getTrendingPosts } from '../api/endpoints'
import LoadingCard from '../components/Common/LoadingCard'
import ErrorCard from '../components/Common/ErrorCard'
import PostCard from '../components/Common/PostCard'

function TrendingPosts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState('desc')
  
  // Fetch trending posts data
  const { 
    data: posts,
    isLoading,
    error,
    refetch
  } = useQuery('trendingPosts', () => getTrendingPosts(20), {
    staleTime: 60000, // 1 minute
  })
  
  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }
  
  const filteredPosts = posts ? posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []
  
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.commentCount - b.commentCount
    } else {
      return b.commentCount - a.commentCount
    }
  })
  
  if (isLoading) {
    return <LoadingCard height="h-screen" message="Loading trending posts data..." />
  }
  
  if (error) {
    return <ErrorCard error={error} onRetry={refetch} />
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Trending Posts</h1>
          <p className="text-neutral-500 mt-1">Posts with the highest comment counts</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleSort}
            className="btn btn-ghost"
          >
            <FiFilter className="mr-2" />
            Comments
            {sortDirection === 'asc' ? (
              <FiArrowUp className="ml-1" />
            ) : (
              <FiArrowDown className="ml-1" />
            )}
          </button>
        </div>
      </div>
      
      {/* Top trending post highlight */}
      {sortedPosts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            <span className="text-primary-600">#1</span> Top Trending Post
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-800">Post by User {sortedPosts[0].userid}</h3>
                    <p className="text-neutral-500">Content about {sortedPosts[0].content.split(' ').slice(-1)[0]}</p>
                  </div>
                  <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {sortedPosts[0].commentCount} comments
                  </div>
                </div>
                <p className="text-neutral-700 text-lg mb-4">{sortedPosts[0].content}</p>
                <div className="relative h-64 -mx-6 overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/random/800x600/?${sortedPosts[0].content.split(' ').slice(-1)[0]}`}
                    alt="Post image"
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="card h-full">
                <h3 className="text-lg font-medium text-neutral-800 mb-4">Top Comments</h3>
                {sortedPosts[0].comments && sortedPosts[0].comments.slice(0, 3).map(comment => (
                  <div key={comment.id} className="py-3 px-4 bg-neutral-50 rounded-lg mb-3">
                    <div className="flex items-center mb-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=U${comment.id % 20 + 1}&background=3B82F6&color=fff&size=32`}
                        alt="User avatar"
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <p className="text-sm font-medium text-neutral-700">User {comment.id % 20 + 1}</p>
                    </div>
                    <p className="text-neutral-600">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPosts.slice(1).map(post => (
          <PostCard
            key={post.id}
            post={post}
            user={{ id: post.userid, name: post.userName || `User ${post.userid}` }}
          />
        ))}
      </div>
      
      {sortedPosts.length === 0 && (
        <div className="card h-64 flex items-center justify-center">
          <p className="text-neutral-500">No posts found matching your search criteria</p>
        </div>
      )}
    </div>
  )
}

export default TrendingPosts