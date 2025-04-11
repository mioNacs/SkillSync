import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Projects', path: '/projects', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Mentorship', path: '/mentorship', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Explore', path: '/explore', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  ]
  
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative left-0 top-0 h-screen w-64 bg-white border-r transition-transform duration-300 ease-in-out z-30 md:z-auto shadow-lg md:shadow-none pt-16 md:pt-0`}>
      <div className="p-4">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold text-indigo-800">SkillSync</h2>
          <p className="text-sm text-gray-600">Connecting skills & people</p>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`flex items-center p-2 rounded-md text-sm ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar 