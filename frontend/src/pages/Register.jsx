import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, Camera } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ActionButton from '../components/ActionButton'
import Avatar from '../components/Avatar'
import { toast } from 'sonner'

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useContext(AuthContext)
  const { theme, toggleTheme } = useTheme()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    setAvatarFile(file || null)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    await handleRegister(
      formData.username.trim(),
      formData.email.trim(),
      formData.password,
      avatarFile
    )
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
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-6 py-10 md:flex-row md:justify-around">
        {/* Left Side: Brand info */}
        <div className="hidden md:flex flex-col max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] text-3xl font-black mb-6">
            Z
          </div>
          <h1 className="text-[40px] font-bold tracking-tight text-[var(--text)] leading-tight">
            Create your account
          </h1>
          <p className="mt-3 text-[17px] text-[var(--muted)] leading-relaxed">
            By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
          </p>
        </div>

        {/* Right Side: Register Form Box */}
        <div className="w-full max-w-[420px] rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-[22px] font-bold text-[var(--text)] mb-6">
            Join Zuno today
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar picker */}
            <div className="flex items-center gap-4 py-1">
              <div className="relative group">
                <Avatar
                  src={avatarPreview}
                  name={formData.username}
                  size="xl"
                />
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white cursor-pointer transition-opacity group-hover:opacity-100 opacity-90">
                  <Camera className="h-6 w-6 stroke-[2]" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-[14px] font-bold text-[var(--text)]">Profile photo</p>
                <p className="text-[12px] text-[var(--muted)]">Add a face to your corner</p>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  required
                  className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
            </div>

            <ActionButton
              type="submit"
              variant="primary"
              size="lg"
              pill
              disabled={isLoading || !formData.username || !formData.email || !formData.password}
              loading={isLoading}
              className="w-full text-center text-[15px] mt-2"
            >
              Sign Up
            </ActionButton>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[var(--border)]" />
            <span className="px-3 text-[13px] text-[var(--muted)] font-normal">or</span>
            <div className="flex-1 border-t border-[var(--border)]" />
          </div>

          <div className="text-center">
            <p className="text-[14px] text-[var(--muted)] mb-3">
              Already have an account?
            </p>
            <ActionButton
              type="button"
              variant="secondary"
              size="md"
              pill
              onClick={() => navigate('/login')}
              className="w-full text-center text-[14px]"
            >
              Sign In
            </ActionButton>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-4 text-center text-[13px] text-[var(--muted)]">
        <p>© 2026 Zuno Corp.</p>
      </footer>
    </div>
  )
}

export default Register
