import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi'

const pageTitle = {
  '/': 'Dashboard',
  '/top-users': 'Top Users',
  '/trending-posts': 'Trending Posts',
  '/feed': 'Real-time Feed',
}

function Header({ setSidebarOpen }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [title, setTitle] = useState('')
  
  useEffect(() => {
    setTitle(pageTitle[location.pathname] || 'Social Media Analytics')
  }, [location])
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header 
      className={`sticky top-0 z-10 ${
        scrolled ? 'bg-white shadow' : 'bg-white/95'
      } transition-all duration-200`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="md:hidden px-4 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <FiMenu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">{title}</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="max-w-xs w-full px-2">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative text-neutral-400 focus-within:text-neutral-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FiSearch className="h-5 w-5" />
                </div>
                <input
                  id="search"
                  className="block w-full bg-neutral-100 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
            <button
              className="p-2 ml-4 rounded-full text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <div className="relative">
                <FiBell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs">
                  3
                </span>
              </div>
            </button>
            <div className="ml-4 flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff"
                  alt="User Avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header