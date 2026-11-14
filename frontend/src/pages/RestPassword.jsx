import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Sun, Moon, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { useTheme } from '../context/ThemeContext'
import ActionButton from '../components/ActionButton'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!password || !confirmPassword) {
      return setError('All fields are required')
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        { token, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      setSuccess(res.data.message || 'Password reset successful')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between transition-colors duration-150">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <Link to="/login" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] text-base font-black">
            Z
          </div>
          <span className="text-[18px] font-bold tracking-tight text-[var(--text)]">
            Zuno
          </span>
        </Link>
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

      {/* Main card */}
      <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 py-12">
        <div className="w-full rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h1 className="text-[22px] font-bold text-[var(--text)] mb-2">
            Reset your password
          </h1>
          <p className="text-[14px] text-[var(--muted)] mb-6">
            Enter a new password for your Zuno account.
          </p>

          {error && (
            <div className="mb-4 rounded-[8px] border border-[var(--danger)] bg-[var(--danger-light)] p-3 text-[14px] text-[var(--danger)]">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-[8px] border border-green-500/30 bg-green-500/10 p-3 text-[14px] text-green-500">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <ActionButton
              type="submit"
              variant="primary"
              size="lg"
              pill
              disabled={loading || !password || !confirmPassword}
              loading={loading}
              className="w-full text-center text-[15px]"
            >
              Reset Password
            </ActionButton>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--accent)] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] px-6 py-4 text-center text-[13px] text-[var(--muted)]">
        <p>© 2026 Zuno Corp.</p>
      </footer>
    </div>
  )
}

export default ResetPassword
