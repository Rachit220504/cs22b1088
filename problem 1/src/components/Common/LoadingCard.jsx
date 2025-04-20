import { FiLoader } from 'react-icons/fi'

function LoadingCard({ height = 'h-64', message = 'Loading data...' }) {
  return (
    <div className={`card ${height} flex flex-col items-center justify-center`}>
      <FiLoader className="h-8 w-8 text-primary-500 animate-spin" />
      <p className="mt-4 text-neutral-500">{message}</p>
    </div>
  )
}

export default LoadingCard