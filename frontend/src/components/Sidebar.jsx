import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Search,
  Bell,
  PlusCircle,
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Avatar from './Avatar'
import ActionButton from './ActionButton'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, handleLogout } = useContext(AuthContext)
  const { theme, toggleTheme } = useTheme()

  if (!user) return null

  const navItems = [
    { label: 'Home', path: '/posts', icon: Home },
    { label: 'Explore', path: '/posts?tab=explore', icon: Search },
    { label: 'Notifications', path: '/posts?tab=notifications', icon: Bell },
    { label: 'Create', path: '/create-post', icon: PlusCircle },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ]

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path
    }
    return location.pathname === path
  }

  const username = user?.username || 'User'
  const handle = `@${username.toLowerCase().replace(/\s+/g, '')}`

  return (
    <aside className="sticky top-0 flex h-screen w-[240px] xl:w-[275px] flex-col justify-between border-r border-[var(--border)] bg-[var(--surface)] p-3">
      {/* Top section: Logo & Nav items */}
      <div className="flex flex-col gap-1">
        {/* Brand logo */}
        <button
          type="button"
          onClick={() => navigate('/posts')}
          className="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          aria-label="Zuno Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] font-black text-lg">
            Z
          </div>
        </button>

        {/* Navigation list */}
        <nav className="mt-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`group flex items-center gap-4 rounded-full px-4 py-3 text-[17px] transition-colors duration-150 hover:bg-[var(--surface-hover)] ${
                  active
                    ? 'font-bold text-[var(--accent)]'
                    : 'font-normal text-[var(--text)]'
                }`}
              >
                <Icon
                  className={`h-6 w-6 stroke-[2] shrink-0 ${
                    active ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-4 rounded-full px-4 py-3 text-[17px] font-normal text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 stroke-[2] shrink-0 text-[var(--text)]" />
            ) : (
              <Moon className="h-6 w-6 stroke-[2] shrink-0 text-[var(--text)]" />
            )}
            <span className="truncate">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </nav>

        {/* Primary Post CTA button */}
        <div className="mt-4 px-1">
          <ActionButton
            variant="primary"
            size="lg"
            pill
            onClick={() => navigate('/create-post')}
            className="w-full text-center text-[16px] font-bold"
          >
            Post
          </ActionButton>
        </div>
      </div>

      {/* Bottom section: User profile row */}
      <div className="mt-auto pt-3">
        <div className="flex items-center justify-between gap-2 rounded-full p-2 transition-colors duration-150 hover:bg-[var(--surface-hover)]">
          <div
            onClick={() => navigate('/profile')}
            className="flex flex-1 min-w-0 items-center gap-2.5 cursor-pointer"
          >
            <Avatar src={user?.avatar} name={username} size="md" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-[14px] font-bold text-[var(--text)]">
                {username}
              </p>
              <p className="truncate text-[13px] text-[var(--muted)] font-normal">
                {handle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--danger-light)] hover:text-[var(--danger)]"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
