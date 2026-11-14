import React, { useContext, useEffect, useState } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { PostContext } from '../context/PostContext'
import MainLayout from '../components/MainLayout'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'
import ActionButton from '../components/ActionButton'
import { PostSkeleton } from '../components/Skeleton'
import EditPopup from '../popups/EditPopup'

const PostPage = () => {
  const POSTS_PER_PAGE = 10

  const { user } = useContext(AuthContext)
  const {
    Allposts,
    createPost,
    UpdatePosts,
    loadingPosts,
  } = useContext(PostContext)

  const [activeTab, setActiveTab] = useState('foryou')
  const [currentPage, setCurrentPage] = useState(1)

  // Quick composer state
  const [composerText, setComposerText] = useState('')
  const [composerImage, setComposerImage] = useState(null)
  const [composerPreview, setComposerPreview] = useState(null)
  const [isPosting, setIsPosting] = useState(false)

  // Edit popup state
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  const orderedPosts = (Array.isArray(Allposts) ? Allposts : []).slice().reverse()
  const totalPages = Math.max(1, Math.ceil(orderedPosts.length / POSTS_PER_PAGE))
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = orderedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setComposerImage(file || null)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setComposerPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setComposerPreview(null)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if ((!composerText.trim() && !composerImage) || isPosting) return

    setIsPosting(true)
    const success = await createPost(composerText.trim(), composerImage)
    setIsPosting(false)
    if (success) {
      setComposerText('')
      setComposerImage(null)
      setComposerPreview(null)
    }
  }

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
    return saved
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <MainLayout title="Home">
      {/* Sticky feed header with tabs */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="hidden px-4 py-3 md:block">
          <h1 className="text-[20px] font-bold text-[var(--text)]">Home</h1>
        </div>
        <div className="flex border-t border-[var(--border)] md:border-t-0">
          <button
            type="button"
            onClick={() => setActiveTab('foryou')}
            className="relative flex flex-1 items-center justify-center py-3.5 text-[15px] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          >
            <span
              className={`${
                activeTab === 'foryou'
                  ? 'font-bold text-[var(--text)]'
                  : 'font-normal text-[var(--muted)]'
              }`}
            >
              For you
            </span>
            {activeTab === 'foryou' && (
              <div className="absolute bottom-0 h-1 w-14 rounded-full bg-[var(--accent)]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('following')}
            className="relative flex flex-1 items-center justify-center py-3.5 text-[15px] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          >
            <span
              className={`${
                activeTab === 'following'
                  ? 'font-bold text-[var(--text)]'
                  : 'font-normal text-[var(--muted)]'
              }`}
            >
              Following
            </span>
            {activeTab === 'following' && (
              <div className="absolute bottom-0 h-1 w-16 rounded-full bg-[var(--accent)]" />
            )}
          </button>
        </div>
      </header>

      {/* Inline Post Composer */}
      <section className="border-b border-[var(--border)] p-3 sm:p-4 bg-[var(--surface)]">
        <form onSubmit={handleCreatePost} className="flex gap-3">
          <Avatar
            src={user?.avatar}
            name={user?.username}
            size="md"
            className="shrink-0 mt-1"
          />
          <div className="flex-1 min-w-0">
            <textarea
              rows={2}
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="What is happening?!"
              className="w-full resize-none bg-transparent text-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none"
            />

            {/* Image preview */}
            {composerPreview && (
              <div className="relative mb-3 mt-2 overflow-hidden rounded-[12px] border border-[var(--border)]">
                <img
                  src={composerPreview}
                  alt="Attachment preview"
                  className="max-h-64 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setComposerImage(null)
                    setComposerPreview(null)
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-opacity hover:opacity-80"
                  title="Remove attachment"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Composer action bar */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
              <label
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--accent-light)] cursor-pointer"
                title="Add photo"
              >
                <ImageIcon className="h-5 w-5 stroke-[2]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <ActionButton
                type="submit"
                variant="primary"
                size="sm"
                pill
                disabled={(!composerText.trim() && !composerImage) || isPosting}
                loading={isPosting}
              >
                Post
              </ActionButton>
            </div>
          </div>
        </form>
      </section>

      {/* Feed list */}
      <section>
        {loadingPosts && orderedPosts.length === 0 ? (
          <div>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={handleEditPost}
            />
          ))
        ) : (
          <div className="p-8 text-center text-[var(--muted)]">
            <p className="text-[16px] font-bold text-[var(--text)]">No posts yet</p>
            <p className="mt-1 text-[14px]">
              When people share moments, they will appear right here in your feed.
            </p>
          </div>
        )}
      </section>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Feed pagination"
          className="flex items-center justify-between border-b border-[var(--border)] p-4 text-[14px] text-[var(--muted)]"
        >
          <ActionButton
            type="button"
            variant="secondary"
            size="sm"
            pill
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </ActionButton>

          <span className="text-[13px] font-semibold text-[var(--text)]">
            Page {currentPage} of {totalPages}
          </span>

          <ActionButton
            type="button"
            variant="secondary"
            size="sm"
            pill
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </ActionButton>
        </nav>
      )}

      {/* Edit Post Modal */}
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

export default PostPage
