import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'

const EditProfilePopup = ({ user, isOpen, isSaving, onClose, onSave }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  useEffect(() => {
    if (!isOpen || !user) return

    setUsername(user.username || '')
    setEmail(user.email || '')
    setAvatarFile(null)
    setAvatarPreview(user.avatar || '')
  }, [isOpen, user])

  useEffect(() => {
    if (!avatarFile) return

    const previewUrl = URL.createObjectURL(avatarFile)
    setAvatarPreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [avatarFile])

  if (!isOpen || !user) return null

  const handleSubmit = async (event) => {
    event.preventDefault()

    const saved = await onSave({
      username,
      email,
      avatarFile,
    })

    if (saved) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/75 px-4 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="glass-panel relative z-10 w-full max-w-2xl rounded-[32px] p-6 text-white">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Edit profile</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Refresh your identity</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Update your username, email, and avatar from one place.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/6 p-3 text-xl text-white transition hover:bg-white/10"
            aria-label="Close edit profile popup"
          >
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Username</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-[20px] border border-white/10 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[20px] border border-white/10 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Replace avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
              className="w-full rounded-[20px] border border-white/10 bg-white/6 p-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900"
            />
          </div>

          {avatarPreview && (
            <div className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <img
                src={avatarPreview}
                alt="Profile preview"
                className="h-24 w-24 rounded-[24px] object-cover ring-1 ring-white/10"
              />
              <div>
                <p className="text-sm font-semibold text-white">Avatar preview</p>
                <p className="mt-1 text-sm text-slate-400">This image will appear on your profile and posts.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="accent-button rounded-full px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfilePopup
