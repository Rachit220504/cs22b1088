import { useState } from 'react'
import { generateUserAvatar } from '../../utils/imageGenerator'

function UserAvatar({ user, size = 'md', showName = false }) {
  const [hasError, setHasError] = useState(false)
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }
  
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }
  
  const avatarUrl = generateUserAvatar(user.id, size === 'xl' ? 200 : 100)
  
  return (
    <div className="flex items-center">
      <img
        src={avatarUrl}
        alt={`${user.name}'s avatar`}
        className={`${sizeClasses[size]} rounded-full object-cover bg-primary-100`}
        onError={() => setHasError(true)}
      />
      {showName && (
        <div className="ml-3">
          <p className={`font-medium text-neutral-800 ${textSize[size]}`}>{user.name}</p>
          {user.email && (
            <p className="text-neutral-500 text-xs">@{user.name.toLowerCase().replace(/\s+/g, '')}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default UserAvatar