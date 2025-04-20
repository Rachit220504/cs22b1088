import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

function StatsCard({ title, value, change, icon: Icon, iconBg }) {
  const isPositive = change >= 0
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-md ${iconBg}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span
          className={`inline-flex items-center text-sm font-medium ${
            isPositive ? 'text-success-700' : 'text-error-700'
          }`}
        >
          {isPositive ? (
            <FiArrowUp className="mr-1 h-4 w-4" />
          ) : (
            <FiArrowDown className="mr-1 h-4 w-4" />
          )}
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-neutral-500 ml-2">from last week</span>
      </div>
    </div>
  )
}

export default StatsCard