import React, { useContext, useEffect, useState } from 'react'
import { Bookmark as BookmarkIcon, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { PostContext } from '../context/PostContext'
import MainLayout from '../components/MainLayout'
import PostCard from '../components/PostCard'
import { PostSkeleton } from '../components/Skeleton'
import EditPopup from '../popups/EditPopup'

const BookmarksPage = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const {
    bookmarkedPosts,
    fetchBookmarkedPosts,
    loadingBookmarks,
    UpdatePosts,
  } = useContext(PostContext)

  // Edit popup state
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  useEffect(() => {
    fetchBookmarkedPosts()
  }, [])

  const handleEditPost = (post) => {
    setSelectedPost(post)
    setIsEditOpen(true)
  }

  const handleCloseEdit = () => {
    setIsEditOpen(false)
    setSelectedPost(null)
  }

  const handleSaveEdit = async (id, updates) => {
    setIsSavingEdit(true)
    const saved = await UpdatePosts(id, updates)
    setIsSavingEdit(false)
    if (saved) {
      await fetchBookmarkedPosts()
    }
    return saved
  }

  const username = user?.username || 'User'
  const handle = `@${username.toLowerCase().replace(/\s+/g, '')}`

  return (
    <MainLayout title="Bookmarks">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex items-center gap-6 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-2.5 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[18px] font-bold text-[var(--text)]">
            Bookmarks
          </h1>
          <p className="truncate text-[13px] text-[var(--muted)] font-normal">
            {handle}
          </p>
        </div>
      </header>

      {/* Bookmarks feed */}
      <section>
        {loadingBookmarks ? (
          <div>
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={handleEditPost}
            />
          ))
        ) : (
          <div className="mx-auto max-w-sm px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--muted)]">
              <BookmarkIcon className="h-7 w-7 stroke-[1.75]" />
            </div>
            <h2 className="text-[22px] font-bold text-[var(--text)]">
              Save posts for later
            </h2>
            <p className="mt-2 text-[14px] text-[var(--muted)] leading-relaxed">
              Don't let the good ones fly away! Bookmark posts to easily find them again anytime.
            </p>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      <EditPopup
        post={selectedPost}
        isOpen={isEditOpen}
        isSaving={isSavingEdit}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </MainLayout>
  )
}

export default BookmarksPage
