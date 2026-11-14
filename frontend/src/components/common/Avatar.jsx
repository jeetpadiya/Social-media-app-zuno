import React, { useState } from 'react'
import { User } from 'lucide-react'

const SIZE_MAP = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-18 h-18 text-xl',
  '2xl': 'w-28 h-28 text-3xl',
}

const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  className = '',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false)
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md

  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : ''

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] font-semibold transition-opacity duration-150 ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:opacity-90' : ''
      } ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="h-full w-full rounded-full object-cover"
        />
      ) : initial ? (
        <span className="font-bold text-[var(--text)]">{initial}</span>
      ) : (
        <User className="h-1/2 w-1/2 text-[var(--muted)] stroke-[1.75]" />
      )}
    </div>
  )
}

export default Avatar
