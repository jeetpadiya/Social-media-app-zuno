import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const TabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadCount } = useContext(AuthContext)

  const tabs = [
    { label: 'Home', path: '/posts', icon: Home },
    { label: 'Search', path: '/posts?tab=search', icon: Search },
    { label: 'Create', path: '/create-post', icon: PlusCircle },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path
    }
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-[var(--border)] bg-[var(--surface)] px-2 md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isActive(tab.path)
        const hasBadge = typeof tab.badge === 'number' && tab.badge > 0
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 ${
              active
                ? 'text-[var(--accent)]'
                : 'text-[var(--text)] hover:text-[var(--accent)]'
            }`}
            aria-label={tab.label}
          >
            <div className="relative">
              <Icon
                className={`h-6 w-6 stroke-[2] ${
                  active ? 'text-[var(--accent)]' : ''
                }`}
              />
              {hasBadge && (
                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[9px] font-bold text-white">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>
          </button>
        )
      })}
    </nav>
  )
}

export default TabBar
