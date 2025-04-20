import { useState } from 'react'
import { useQuery } from 'react-query'
import { FiArrowUp, FiArrowDown, FiUsers, FiMessageSquare, FiAward } from 'react-icons/fi'
import { getTopUsers } from '../api/endpoints'
import LoadingCard from '../components/Common/LoadingCard'
import ErrorCard from '../components/Common/ErrorCard'
import UserAvatar from '../components/Common/UserAvatar'

function TopUsers() {
  const [sortField, setSortField] = useState('totalEngagement')
  const [sortDirection, setSortDirection] = useState('desc')
  
  // Fetch top users data
  const { 
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery('topUsers', () => getTopUsers(10), {
    staleTime: 60000, // 1 minute
  })
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }
  
  const sortUsers = (usersToSort) => {
    if (!usersToSort) return []
    
    return [...usersToSort].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (sortDirection === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }
  
  if (isLoading) {
    return <LoadingCard height="h-screen" message="Loading top users data..." />
  }
  
  if (error) {
    return <ErrorCard error={error} onRetry={refetch} />
  }
  
  const sortedUsers = sortUsers(users)
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Top Users</h1>
          <p className="text-neutral-500 mt-1">Users with the most comments and posts</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSort('postCount')}
            className={`btn ${
              sortField === 'postCount' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <FiMessageSquare className="mr-2" />
            Posts
            {sortField === 'postCount' && (
              sortDirection === 'asc' ? (
                <FiArrowUp className="ml-1" />
              ) : (
                <FiArrowDown className="ml-1" />
              )
            )}
          </button>
          
          <button
            onClick={() => handleSort('commentCount')}
            className={`btn ${
              sortField === 'commentCount' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <FiMessageSquare className="mr-2" />
            Comments
            {sortField === 'commentCount' && (
              sortDirection === 'asc' ? (
                <FiArrowUp className="ml-1" />
              ) : (
                <FiArrowDown className="ml-1" />
              )
            )}
          </button>
          
          <button
            onClick={() => handleSort('totalEngagement')}
            className={`btn ${
              sortField === 'totalEngagement' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <FiUsers className="mr-2" />
            Total Engagement
            {sortField === 'totalEngagement' && (
              sortDirection === 'asc' ? (
                <FiArrowUp className="ml-1" />
              ) : (
                <FiArrowDown className="ml-1" />
              )
            )}
          </button>
        </div>
      </div>
      
      {/* Top 3 Users Cards */}
      {sortedUsers.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {sortedUsers.slice(0, 3).map((user, index) => (
            <div key={user.id} className="card text-center relative">
              {/* Award badge for top user */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className={`rounded-full p-2 inline-flex ${
                  index === 0 ? 'bg-yellow-400' :
                  index === 1 ? 'bg-neutral-300' :
                  'bg-amber-600'
                }`}>
                  <FiAward className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="mt-4 flex flex-col items-center">
                <UserAvatar user={user} size="xl" />
                <h3 className="mt-4 text-lg font-semibold text-neutral-800">{user.name}</h3>
                <p className="text-neutral-500">@{user.name.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-3 divide-x divide-neutral-200">
                <div className="px-2 text-center">
                  <p className="text-lg font-bold text-primary-600">{user.postCount}</p>
                  <p className="text-xs text-neutral-500">Posts</p>
                </div>
                <div className="px-2 text-center">
                  <p className="text-lg font-bold text-accent-600">{user.commentCount}</p>
                  <p className="text-xs text-neutral-500">Comments</p>
                </div>
                <div className="px-2 text-center">
                  <p className="text-lg font-bold text-secondary-600">{user.totalEngagement}</p>
                  <p className="text-xs text-neutral-500">Total</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Users Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-cell-head">Rank</th>
                <th className="table-cell-head">User</th>
                <th className="table-cell-head text-center">
                  <button
                    onClick={() => handleSort('postCount')}
                    className="flex items-center justify-center w-full"
                  >
                    Posts
                    {sortField === 'postCount' && (
                      sortDirection === 'asc' ? (
                        <FiArrowUp className="ml-1" />
                      ) : (
                        <FiArrowDown className="ml-1" />
                      )
                    )}
                  </button>
                </th>
                <th className="table-cell-head text-center">
                  <button
                    onClick={() => handleSort('commentCount')}
                    className="flex items-center justify-center w-full"
                  >
                    Comments
                    {sortField === 'commentCount' && (
                      sortDirection === 'asc' ? (
                        <FiArrowUp className="ml-1" />
                      ) : (
                        <FiArrowDown className="ml-1" />
                      )
                    )}
                  </button>
                </th>
                <th className="table-cell-head text-center">
                  <button
                    onClick={() => handleSort('totalEngagement')}
                    className="flex items-center justify-center w-full"
                  >
                    Total Engagement
                    {sortField === 'totalEngagement' && (
                      sortDirection === 'asc' ? (
                        <FiArrowUp className="ml-1" />
                      ) : (
                        <FiArrowDown className="ml-1" />
                      )
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {sortedUsers.map((user, index) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-medium">
                      {index + 1}
                    </div>
                  </td>
                  <td className="table-cell">
                    <UserAvatar user={user} showName={true} />
                  </td>
                  <td className="table-cell text-center font-medium">{user.postCount}</td>
                  <td className="table-cell text-center font-medium">{user.commentCount}</td>
                  <td className="table-cell text-center">
                    <span className="font-semibold text-primary-600">{user.totalEngagement}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TopUsers