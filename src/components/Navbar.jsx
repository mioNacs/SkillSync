import { Link } from 'react-router-dom'

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-indigo-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="font-bold text-xl">SkillSync</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="hover:text-indigo-200">Explore</Link>
            <Link to="/projects" className="hover:text-indigo-200">Projects</Link>
            <Link to="/mentorship" className="hover:text-indigo-200">Mentorship</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-indigo-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <Link to="/profile" className="flex items-center space-x-1">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="font-bold">JS</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 