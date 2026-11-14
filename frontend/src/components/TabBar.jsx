import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react'

const TabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { label: 'Home', path: '/posts', icon: Home },
    { label: 'Search', path: '/posts?tab=search', icon: Search },
    { label: 'Create', path: '/create-post', icon: PlusCircle },
    { label: 'Notifications', path: '/posts?tab=notifications', icon: Bell },
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
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 ${
              active
                ? 'text-[var(--accent)]'
                : 'text-[var(--text)] hover:text-[var(--accent)]'
            }`}
            aria-label={tab.label}
          >
            <Icon
              className={`h-6 w-6 stroke-[2] ${
                active ? 'text-[var(--accent)]' : ''
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}

export default TabBar
