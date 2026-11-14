import React, { useEffect, useState } from 'react'
import { X, Image as ImageIcon } from 'lucide-react'
import ActionButton from '../components/ActionButton'

const EditPopup = ({ post, isOpen, isSaving, onClose, onSave }) => {
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    if (!isOpen || !post) return
    setText(post.text || '')
    setImageFile(null)
    setImagePreview(post.image || '')
  }, [isOpen, post])

  useEffect(() => {
    if (!imageFile) return
    const previewUrl = URL.createObjectURL(imageFile)
    setImagePreview(previewUrl)
    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [imageFile])

  if (!isOpen || !post) return null

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setImageFile(file)
    if (!file && post.image) {
      setImagePreview(post.image)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const saved = await onSave(post._id, { text, image: imageFile })
    if (saved) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-backdrop)] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--text)] transition-fast">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-[17px] font-bold text-[var(--text)]">Edit post</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[var(--muted)] mb-1">
              Caption
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you want to say?"
              rows={4}
              className="w-full resize-none rounded-[12px] border border-[var(--border)] bg-transparent p-3 text-[15px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer text-[14px] font-semibold text-[var(--accent)] hover:underline">
              <ImageIcon className="h-4 w-4" />
              <span>{imagePreview ? 'Replace image' : 'Add image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {imagePreview && (
            <div className="relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-hover)]">
              <img
                src={imagePreview}
                alt="Post preview"
                className="max-h-56 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null)
                  setImagePreview('')
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-opacity hover:opacity-80"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-[var(--border)] pt-3">
            <ActionButton
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isSaving}
              loading={isSaving}
            >
              Save
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPopup
