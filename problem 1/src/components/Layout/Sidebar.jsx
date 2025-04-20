import { NavLink } from 'react-router-dom'
import { FiHome, FiUsers, FiTrendingUp, FiList, FiSettings, FiHelpCircle, FiX } from 'react-icons/fi'

const navigation = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Top Users', href: '/top-users', icon: FiUsers },
  { name: 'Trending Posts', href: '/trending-posts', icon: FiTrendingUp },
  { name: 'Feed', href: '/feed', icon: FiList },
]

const secondaryNavigation = [
  { name: 'Settings', href: '#', icon: FiSettings },
  { name: 'Help & Support', href: '#', icon: FiHelpCircle },
]

function Sidebar({ mobile = false, closeSidebar }) {
  return (
    <div className="h-full flex flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-primary-600">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
            <rect x="3" y="4" width="18" height="12" rx="2"></rect>
            <path d="M8 8v4"></path>
            <path d="M12 8v4"></path>
            <path d="M16 8v4"></path>
          </svg>
          <span className="ml-2 text-xl font-bold text-white">SocialAnalytics</span>
        </div>
        {mobile && (
          <button
            type="button"
            className="text-white hover:text-neutral-100 focus:outline-none"
            onClick={closeSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <FiX className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          <div className="py-2">
            <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Analytics
            </p>
            <div className="mt-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150`
                  }
                >
                  <item.icon
                    className="mr-3 h-5 w-5 text-primary-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="py-2">
            <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Support
            </p>
            <div className="mt-2 space-y-1">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-neutral-600 rounded-md hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-150"
                >
                  <item.icon
                    className="mr-3 h-5 w-5 text-neutral-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
        <div className="px-3 py-4 border-t border-neutral-200">
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full"
              src="https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff"
              alt="User avatar"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-700">Business User</p>
              <p className="text-xs text-neutral-500">View profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar