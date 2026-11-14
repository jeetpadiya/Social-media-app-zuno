import React from 'react'

export const Skeleton = ({ className = '', rounded = 'rounded-[8px]' }) => {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      aria-hidden="true"
    />
  )
}

export const PostSkeleton = () => {
  return (
    <div className="flex gap-3 border-b border-[var(--border)] p-4 bg-[var(--surface)]">
      <Skeleton className="h-10 w-10 shrink-0" rounded="rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-48 w-full" rounded="rounded-[12px]" />
        <div className="flex items-center justify-between pt-1 pr-6">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  )
}

export const ProfileSkeleton = () => {
  return (
    <div className="bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] p-4">
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-36 w-full" rounded="rounded-none" />
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-end -mt-16">
          <Skeleton className="h-24 w-24 border-4 border-[var(--bg)]" rounded="rounded-full" />
          <Skeleton className="h-9 w-28" rounded="rounded-full" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="border-b border-[var(--border)] flex">
        <div className="flex-1 p-3 flex justify-center">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex-1 p-3 flex justify-center">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 p-1">
        <Skeleton className="aspect-square w-full" rounded="rounded-none" />
        <Skeleton className="aspect-square w-full" rounded="rounded-none" />
        <Skeleton className="aspect-square w-full" rounded="rounded-none" />
      </div>
    </div>
  )
}

export default Skeleton
