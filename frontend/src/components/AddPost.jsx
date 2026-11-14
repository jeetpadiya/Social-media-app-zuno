import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react'
import { PostContext } from '../context/PostContext'
import { AuthContext } from '../context/AuthContext'
import MainLayout from './MainLayout'
import Avatar from './Avatar'
import ActionButton from './ActionButton'

const AddPost = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { createPost } = useContext(PostContext)

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setImage(file || null)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if ((!text.trim() && !image) || isSubmitting) return

    setIsSubmitting(true)
    const created = await createPost(text.trim(), image)
    setIsSubmitting(false)
    if (created) {
      setText('')
      setImage(null)
      setImagePreview(null)
      navigate('/posts')
    }
  }

  const username = user?.username || 'User'
  const handle = `@${username.toLowerCase().replace(/\s+/g, '')}`

  return (
    <MainLayout title="Create Post">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[18px] font-bold text-[var(--text)]">Create Post</h1>
        </div>

        <ActionButton
          type="button"
          variant="primary"
          size="sm"
          pill
          disabled={(!text.trim() && !image) || isSubmitting}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Post
        </ActionButton>
      </header>

      {/* Compose Form */}
      <div className="p-4 bg-[var(--surface)]">
        <div className="flex gap-3">
          <Avatar src={user?.avatar} name={username} size="md" className="shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <span className="font-bold text-[14px] text-[var(--text)]">{username}</span>
              <span className="ml-1 text-[13px] text-[var(--muted)]">{handle}</span>
            </div>

            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you want to share?"
              className="w-full resize-none bg-transparent text-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none"
              autoFocus
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mb-3 mt-2 overflow-hidden rounded-[12px] border border-[var(--border)]">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="max-h-80 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-opacity hover:opacity-80"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Bottom tools */}
            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
              <label
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[14px] font-semibold text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--accent-light)] cursor-pointer"
                title="Add photo"
              >
                <ImageIcon className="h-5 w-5 stroke-[2]" />
                <span>Media</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <span className="text-[12px] text-[var(--muted)]">
                {text.length > 0 ? `${text.length} characters` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default AddPost
