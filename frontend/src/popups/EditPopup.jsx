import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/75 px-4 backdrop-blur-md">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="glass-panel relative z-10 w-full max-w-2xl rounded-[32px] p-6 text-white">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Edit post</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Refine your caption</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Update the text and optionally replace the image before saving.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/6 p-3 text-xl text-white transition hover:bg-white/10"
            aria-label="Close edit popup"
          >
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Caption</label>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-36 w-full rounded-[24px] border border-white/10 bg-[#f8fafc] p-4 text-black focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Update your caption"
              rows="5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Replace image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-[20px] border border-white/10 bg-white/6 p-3 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900"
            />
          </div>

          {imagePreview && (
            <div className="overflow-hidden rounded-[24px] border border-white/10">
              <img
                src={imagePreview}
                alt="Updated post preview"
                className="max-h-[20rem] w-full object-cover"
              />
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
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPopup
