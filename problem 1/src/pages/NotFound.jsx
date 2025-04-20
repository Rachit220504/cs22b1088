import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold text-neutral-800 mt-4">Page Not Found</h2>
        <p className="text-neutral-600 mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn btn-primary px-6 py-3"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound