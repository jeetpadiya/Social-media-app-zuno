import React, { useEffect, useState } from 'react'
import { X, Camera } from 'lucide-react'
import ActionButton from '../components/ActionButton'
import Avatar from '../components/Avatar'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-backdrop)] px-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--text)] transition-fast">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-[17px] font-bold text-[var(--text)]">Edit profile</h2>
          </div>
          <ActionButton
            type="button"
            variant="dark"
            size="sm"
            pill
            disabled={isSaving}
            loading={isSaving}
            onClick={handleSubmit}
          >
            Save
          </ActionButton>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative group">
              <Avatar
                src={avatarPreview}
                name={username}
                size="xl"
              />
              <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-90 cursor-pointer transition-opacity group-hover:opacity-100">
                <Camera className="h-6 w-6 stroke-[2]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-[14px] font-bold text-[var(--text)]">Profile photo</p>
              <p className="text-[13px] text-[var(--muted)]">Click on avatar to change</p>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-[8px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfilePopup
