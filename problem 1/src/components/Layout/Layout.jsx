import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location])
  
  return (
    <div className="h-screen flex overflow-hidden bg-neutral-50">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-neutral-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white">
          <Sidebar mobile={true} closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 flex flex-col">
          <Sidebar />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout