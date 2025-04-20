import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-neutral-200 shadow-lg rounded-md">
        <p className="font-medium text-neutral-800">{label}</p>
        <p className="text-sm text-primary-600">
          Posts: {payload[0].value}
        </p>
        <p className="text-sm text-accent-600">
          Comments: {payload[1].value}
        </p>
      </div>
    )
  }
  return null
}

function UserEngagementChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card h-64 flex items-center justify-center">
        <p className="text-neutral-500">No data available</p>
      </div>
    )
  }
  
  // Transform data for the chart
  const chartData = data.map(user => ({
    name: user.name.split(' ')[0],
    posts: user.postCount,
    comments: user.commentCount,
  }))
  
  return (
    <div className="card h-80">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">Top User Engagement</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="posts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comments" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default UserEngagementChart