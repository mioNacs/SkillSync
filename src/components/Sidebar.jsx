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
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`${isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed inset-0 bg-black z-20 transition-opacity duration-300 md:hidden`}
        onClick={() => document.dispatchEvent(new CustomEvent('toggleSidebar'))}
      ></div>
      
      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed top-0 left-0 h-full w-72 bg-white border-r z-30 shadow-lg md:shadow-none overflow-hidden transition-transform duration-300 ease-in-out`}>
        {/* Fixed height sidebar content with scrollable interior */}
        <div className="h-full flex flex-col pt-16">
          <div className="p-4 flex-1 overflow-y-auto scrollbar-thin">
            <div className="border-b pb-4 mb-6 flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-full bg-indigo-100 mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-indigo-800">SkillSync</h2>
              <p className="text-sm text-gray-600">Connecting skills & people</p>
              
              <div className="mt-3 text-center md:text-left w-full">
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                        JS
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">John Smith</p>
                      <p className="text-xs text-gray-500">Frontend Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.name}>
                      <Link 
                        to={item.path} 
                        className={`flex items-center p-3 rounded-lg text-sm transition-all duration-200 ${
                          isActive 
                            ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={item.icon} />
                        </svg>
                        <span>{item.name}</span>
                        {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-800 text-sm">Upgrade to Pro</h3>
              <p className="text-xs text-gray-600 mt-1">Get access to advanced features and priority support.</p>
              <button className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 