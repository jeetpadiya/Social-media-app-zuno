import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Avatar from './Avatar'

const TopBar = ({ title = 'Home' }) => {
  const navigate = useNavigate()
  const { user, handleLogout } = useContext(AuthContext)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-13 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 md:hidden">
      {/* User avatar on left */}
      <div className="flex items-center">
        <Avatar
          src={user?.avatar}
          name={user?.username}
          size="sm"
          onClick={() => navigate('/profile')}
        />
      </div>

      {/* Brand logo in center */}
      <button
        type="button"
        onClick={() => navigate('/posts')}
        className="flex items-center gap-1.5 font-black text-lg text-[var(--text)] tracking-tight"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] text-sm font-black">
          Z
        </div>
      </button>

      {/* Right controls: Theme toggle & logout */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 stroke-[2]" />
          ) : (
            <Moon className="h-5 w-5 stroke-[2]" />
          )}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--danger-light)] hover:text-[var(--danger)]"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4 stroke-[2]" />
        </button>
      </div>
    </header>
  )
}

export default TopBar
