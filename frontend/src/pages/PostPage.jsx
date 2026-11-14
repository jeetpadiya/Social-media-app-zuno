import React, { useContext, useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, X, Check } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { PostContext } from '../context/PostContext'
import MainLayout from '../components/MainLayout'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'
import ActionButton from '../components/ActionButton'
import { PostSkeleton } from '../components/Skeleton'
import EditPopup from '../popups/EditPopup'

const PostPage = () => {
  const INITIAL_BATCH = 8
  const BATCH_SIZE = 6

  const { user } = useContext(AuthContext)
  const {
    Allposts,
    followingPosts,
    fetchFollowingPosts,
    createPost,
    UpdatePosts,
    loadingPosts,
    loadingFollowing,
  } = useContext(PostContext)

  const [activeTab, setActiveTab] = useState('foryou')
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (activeTab === 'following') {
      fetchFollowingPosts()
    }
    setVisibleCount(INITIAL_BATCH)
  }, [activeTab])

  // Quick composer state
  const [composerText, setComposerText] = useState('')
  const [composerImage, setComposerImage] = useState(null)
  const [composerPreview, setComposerPreview] = useState(null)
  const [isPosting, setIsPosting] = useState(false)

  // Edit popup state
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  const activePostList = activeTab === 'following' ? followingPosts : Allposts
  const orderedPosts = (Array.isArray(activePostList) ? activePostList : []).slice().reverse()
  const visiblePosts = orderedPosts.slice(0, visibleCount)
  const hasMore = visibleCount < orderedPosts.length

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    if (!sentinelRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            if (prev < orderedPosts.length) {
              return prev + BATCH_SIZE
            }
            return prev
          })
        }
      },
      { rootMargin: '350px' }
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [orderedPosts.length, visibleCount])

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
        {(activeTab === 'following' ? loadingFollowing : loadingPosts) && orderedPosts.length === 0 ? (
          <div>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : visiblePosts.length > 0 ? (
          visiblePosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={handleEditPost}
            />
          ))
        ) : (
          <div className="p-8 text-center text-[var(--muted)]">
            <p className="text-[16px] font-bold text-[var(--text)]">
              {activeTab === 'following'
                ? 'No posts from accounts you follow yet'
                : 'No posts yet'}
            </p>
            <p className="mt-1 text-[14px]">
              {activeTab === 'following'
                ? 'When you follow creators from the Explore or "For you" feed, their posts will show up here.'
                : 'When people share moments, they will appear right here in your feed.'}
            </p>
          </div>
        )}
      </section>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="py-2">
          <PostSkeleton />
        </div>
      )}

      {/* All caught up footer */}
      {!hasMore && orderedPosts.length > 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center text-[var(--muted)] border-b border-[var(--border)]">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent)]">
            <Check className="h-4 w-4 stroke-[2.5]" />
          </div>
          <p className="text-[14px] font-bold text-[var(--text)]">You're all caught up</p>
          <p className="text-[13px] text-[var(--muted)]">You've seen all recent posts in this feed.</p>
        </div>
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
