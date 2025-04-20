import { useState, useEffect } from 'react'
import { FiMessageSquare, FiShare2, FiHeart } from 'react-icons/fi'
import UserAvatar from './UserAvatar'
import { generatePostImage, timeAgo, randomEngagement } from '../../utils/imageGenerator'

function PostCard({ post, user, showComments = false, isExpanded = false }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(() => randomEngagement(5, 200))
  const [shares, setShares] = useState(() => randomEngagement(1, 50))
  const [imageLoaded, setImageLoaded] = useState(false)

  // Always generate a fallback image
  const fallbackImage = generatePostImage(post.id, post.content || post.title || '')
  
  // Determine the best image source
  const getImageSource = () => {
    // If the post has a direct image URL that's usable, use it
    if (post.imageUrl && !post.imageUrl.includes("&amp;")) {
      return post.imageUrl;
    }
    
    // If the post has an image URL with HTML entities, decode it
    if (post.imageUrl && post.imageUrl.includes("&amp;")) {
      return post.imageUrl.replace(/&amp;/g, '&');
    }
    
    // Otherwise use our fallback generated image
    return fallbackImage;
  }
  
  const handleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }
  
  const handleImageError = () => {
    console.log("Image failed to load, using fallback for post:", post.id)
    setImageLoaded(false)
  }
  
  const handleImageLoad = () => {
    setImageLoaded(true)
  }
  
  return (
    <div className="card mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <UserAvatar user={user} showName={true} />
        <span className="ml-auto text-sm text-neutral-500">{timeAgo(post.id)}</span>
      </div>
      
      <p className="text-neutral-800 mb-4">{post.content || post.title}</p>
      
      {!isExpanded && (
        <div className="relative h-48 -mx-6 mb-4 overflow-hidden bg-neutral-100">
          <img
            src={getImageSource()}
            alt="Post content"
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          
          {/* Fallback image in case primary image fails to load */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <img
                src={fallbackImage}
                alt="Fallback post image"
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between text-neutral-500 pt-2 border-t border-neutral-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 py-2 px-3 rounded-md transition-colors ${
            liked ? 'text-error-500' : 'hover:text-neutral-700'
          }`}
        >
          <FiHeart className={`${liked ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </button>
        
        <button className="flex items-center space-x-1 py-2 px-3 rounded-md hover:text-neutral-700 transition-colors">
          <FiMessageSquare />
          <span>{post.commentCount || post.num_comments || 0}</span>
        </button>
        
        <button className="flex items-center space-x-1 py-2 px-3 rounded-md hover:text-neutral-700 transition-colors">
          <FiShare2 />
          <span>{shares}</span>
        </button>
      </div>
      
      {showComments && post.comments && post.comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Comments</h4>
          {post.comments.map(comment => (
            <div key={comment.id} className="py-2 px-3 bg-neutral-50 rounded-lg mb-2">
              <div className="flex items-center mb-1">
                <p className="text-xs font-medium text-neutral-700">User {comment.id % 20 + 1}</p>
                <span className="ml-auto text-xs text-neutral-500">{timeAgo(comment.id)}</span>
              </div>
              <p className="text-sm text-neutral-600">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostCard