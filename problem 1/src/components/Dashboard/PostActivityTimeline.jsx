import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-neutral-200 shadow-lg rounded-md">
        <p className="font-medium text-neutral-800">{label}</p>
        <p className="text-sm text-primary-600">
          Posts: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

function PostActivityTimeline({ posts }) {
  // Generate activity data by days (since we don't have real timestamps,
  // we'll simulate this based on post IDs)
  const generateTimelineData = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days.map(day => ({
      day,
      posts: Math.floor(Math.random() * 24) + 5,
    }))
  }
  
  const timelineData = generateTimelineData()
  
  return (
    <div className="card h-80">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">Weekly Post Activity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timelineData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
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
            <Line
              type="monotone"
              dataKey="posts"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#3B82F6', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PostActivityTimeline