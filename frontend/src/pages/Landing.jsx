import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ActionButton from '../components/ActionButton'

const Landing = () => {
  const navigate = useNavigate()
  const { handleLogin } = useContext(AuthContext)
  const { theme, toggleTheme } = useTheme()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password || isLoading) return
    setIsLoading(true)
    await handleLogin(formData.email, formData.password)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between transition-colors duration-150">
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] text-base font-black">
            Z
          </div>
          <span className="text-[18px] font-bold tracking-tight text-[var(--text)]">
            Zuno
          </span>
        </div>
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
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-6 py-12 md:flex-row md:justify-around">
        {/* Left Side: Brand presentation */}
        <div className="hidden md:flex flex-col max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] text-3xl font-black mb-6">
            Z
          </div>
          <h1 className="text-[40px] font-bold tracking-tight text-[var(--text)] leading-tight">
            Happening now
          </h1>
          <p className="mt-3 text-[17px] text-[var(--muted)] leading-relaxed">
            Join the conversation. Connect with creators, share stories, and discover what matters.
          </p>
        </div>

        {/* Right Side: Auth Form Box */}
        <div className="w-full max-w-[380px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-[22px] font-bold text-[var(--text)] mb-6">
            Sign in to Zuno
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
                Email or Username
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[13px] font-bold text-[var(--muted)]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[12px] font-semibold text-[var(--accent)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <ActionButton
              type="submit"
              variant="primary"
              size="lg"
              pill
              disabled={isLoading || !formData.email || !formData.password}
              loading={isLoading}
              className="w-full text-center text-[15px] mt-2"
            >
              Sign In
            </ActionButton>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[var(--border)]" />
            <span className="px-3 text-[13px] text-[var(--muted)] font-normal">or</span>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>

          {/* Register CTA */}
          <div className="text-center">
            <p className="text-[14px] text-[var(--muted)] mb-3">
              Don't have an account?
            </p>
            <ActionButton
              type="button"
              variant="secondary"
              size="md"
              pill
              onClick={() => navigate('/register')}
              className="w-full text-center text-[14px]"
            >
              Create Account
            </ActionButton>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-4 text-center text-[13px] text-[var(--muted)]">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-1">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Cookie Policy</span>
        </div>
        <p>© 2026 Zuno Corp.</p>
      </footer>
    </div>
  )
}

export default Landing
