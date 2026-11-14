import React from 'react'

const ActionButton = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  pill = true,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold select-none cursor-pointer transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50'

  const shapeClass = pill ? 'rounded-full' : 'rounded-[8px]'

  const sizeClasses = {
    sm: 'px-3.5 py-1 text-[13px] gap-1.5 h-8',
    md: 'px-4 py-2 text-[14px] gap-2 h-9',
    lg: 'px-6 py-2.5 text-[15px] gap-2 h-11',
  }[size] || 'px-4 py-2 text-[14px] gap-2 h-9'

  const variantClasses = {
    primary:
      'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] border border-transparent',
    secondary:
      'bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] border border-[var(--border)]',
    ghost:
      'bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text)] border border-transparent',
    danger:
      'bg-transparent hover:bg-[var(--danger-light)] text-[var(--danger)] border border-[var(--danger)]',
    'accent-outline':
      'bg-transparent hover:bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]',
    dark:
      'bg-[#0f1419] hover:bg-[#272c30] text-white border border-transparent dark:bg-[#eff3f4] dark:hover:bg-[#d7dbdc] dark:text-[#0f1419]',
  }[variant] || 'bg-[var(--accent)] text-white'

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${shapeClass} ${sizeClasses} ${variantClasses} ${
        loading ? 'animate-pulse' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="h-4 w-4 shrink-0 stroke-[2]" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="h-4 w-4 shrink-0 stroke-[2]" />}
        </>
      )}
    </button>
  )
}

export default ActionButton
