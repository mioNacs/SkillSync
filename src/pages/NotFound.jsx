import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </Link>
          <Link
            to="/explore"
            className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Explore Skills
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound 