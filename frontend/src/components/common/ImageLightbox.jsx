import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const ImageLightbox = ({ src, alt = 'Image preview', isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !src) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-fast backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-150 hover:bg-black/90"
        aria-label="Close image"
      >
        <X className="h-6 w-6 stroke-[2]" />
      </button>

      {/* Image container */}
      <div
        className="relative max-h-[92vh] max-w-[92vw] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-[90vw] rounded-[12px] object-contain shadow-none"
        />
      </div>
    </div>
  )
}

export default ImageLightbox
