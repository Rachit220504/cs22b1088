import { FiAlertTriangle } from 'react-icons/fi'

function ErrorCard({ error, onRetry }) {
  return (
    <div className="card h-64 flex flex-col items-center justify-center">
      <FiAlertTriangle className="h-8 w-8 text-error-500" />
      <p className="mt-4 text-neutral-700 font-medium">Error loading data</p>
      <p className="mt-1 text-neutral-500">{error?.message || 'Something went wrong'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorCard