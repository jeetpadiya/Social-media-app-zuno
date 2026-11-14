import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal,
  Trash2,
  Edit3,
  Send,
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { PostContext } from '../context/PostContext'
import MainLayout from '../components/MainLayout'
import Avatar from '../components/Avatar'
import ActionButton from '../components/ActionButton'
import ImageLightbox from '../components/ImageLightbox'
import { PostSkeleton } from '../components/Skeleton'
import EditPopup from '../popups/EditPopup'
import { toast } from 'sonner'

const formatExactTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const day = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return `${time} · ${day}`
}

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'now'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000))
  if (seconds < 60) return `${Math.max(1, seconds)}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, user, isPostBookmarked, toggleBookmark } = useContext(AuthContext)
  const { likePosts, deltePosts, postsComments, UpdatePosts } = useContext(PostContext)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [hasReposted, setHasReposted] = useState(false)

  const currentUserId = (user?._id || user?.id)?.toString()

  const fetchPost = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/posts/post/${id}`)
      if (data.success) {
        setPost(data.post)
      } else {
        toast.error('Post not found')
        navigate('/posts')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load post')
      navigate('/posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  if (loading) {
    return (
      <MainLayout title="Post">
        <header className="sticky top-0 z-20 flex items-center gap-6 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-2.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[18px] font-bold text-[var(--text)]">Post</h1>
        </header>
        <PostSkeleton />
      </MainLayout>
    )
  }

  if (!post) return null

  const postAuthor = post.user || {}
  const authorId = (postAuthor._id || postAuthor.id)?.toString()
  const isPostOwner = currentUserId && authorId && currentUserId === authorId
  const username = postAuthor.username || 'User'
  const handle = `@${username.toLowerCase().replace(/\s+/g, '')}`

  const likesList = Array.isArray(post.likes) ? post.likes : []
  const hasLiked = likesList.some((likedUser) => {
    const uid = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
    return uid?.toString() === currentUserId
  })
  const isBookmarked = isPostBookmarked(post._id)
  const comments = Array.isArray(post.comments) ? post.comments : []

  const handleLike = async () => {
    likePosts(post._id)
    setPost((prev) => {
      if (!prev) return prev
      const currentLikes = Array.isArray(prev.likes) ? [...prev.likes] : []
      const alreadyLiked = currentLikes.some((likedUser) => {
        const uid = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
        return uid?.toString() === currentUserId
      })
      const updated = alreadyLiked
        ? currentLikes.filter((likedUser) => {
            const uid = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
            return uid?.toString() !== currentUserId
          })
        : [...currentLikes, currentUserId]
      return { ...prev, likes: updated }
    })
  }

  const handleBookmark = async () => {
    await toggleBookmark(post._id)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      toast.success('Post link copied to clipboard')
    }
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    const text = replyText.trim()
    if (!text || isSubmittingReply) return

    setIsSubmittingReply(true)
    const success = await postsComments(post._id, text)
    setIsSubmittingReply(false)
    if (success) {
      setReplyText('')
      const newComment = {
        _id: Date.now().toString(),
        text,
        createdAt: new Date().toISOString(),
        user: {
          _id: user?._id || user?.id,
          username: user?.username || 'You',
          avatar: user?.avatar || '',
        },
      }
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }))
    }
  }

  const handleDelete = () => {
    setShowMenu(false)
    if (window.confirm('Delete this post?')) {
      deltePosts(post._id)
      navigate('/posts')
    }
  }

  const handleSaveEdit = async (postId, updates) => {
    setIsSavingEdit(true)
    const saved = await UpdatePosts(postId, updates)
    setIsSavingEdit(false)
    if (saved) {
      fetchPost()
    }
    return saved
  }

  return (
    <MainLayout title="Post">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 flex items-center gap-6 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-2.5 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-[18px] font-bold text-[var(--text)]">Post</h1>
      </header>

      {/* Main Post Article */}
      <article className="border-b border-[var(--border)] bg-[var(--surface)] p-4">
        {/* Author row */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => {
              if (authorId === currentUserId) navigate('/profile')
              else if (authorId) navigate(`/users/${authorId}`)
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Avatar src={postAuthor.avatar} name={username} size="lg" />
            <div>
              <p className="font-bold text-[16px] text-[var(--text)] hover:underline leading-tight">
                {username}
              </p>
              <p className="text-[14px] text-[var(--muted)] font-normal">{handle}</p>
            </div>
          </div>

          {/* Owner options menu */}
          {isPostOwner && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-9 z-30 min-w-[140px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-1 text-[14px] shadow-none">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false)
                      setIsEditOpen(true)
                    }}
                    className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left font-semibold text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
                  >
                    <Edit3 className="h-4 w-4 text-[var(--muted)]" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left font-semibold text-[var(--danger)] transition-colors duration-150 hover:bg-[var(--danger-light)]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content text */}
        {post.text && (
          <p className="mt-4 whitespace-pre-wrap break-words text-[18px] font-normal leading-relaxed text-[var(--text)]">
            {post.text}
          </p>
        )}

        {/* Media */}
        {post.image && (
          <>
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="mt-3 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-hover)] cursor-pointer"
            >
              <img
                src={post.image}
                alt="Post attachment"
                className="max-h-[550px] w-full object-cover transition-opacity duration-150 hover:opacity-95"
              />
            </div>
            <ImageLightbox
              src={post.image}
              isOpen={isLightboxOpen}
              onClose={() => setIsLightboxOpen(false)}
            />
          </>
        )}

        {/* Timestamp */}
        <div className="mt-4 text-[14px] text-[var(--muted)]">
          {formatExactTime(post.createdAt)}
        </div>

        {/* Stats metrics row */}
        {(likesList.length > 0 || comments.length > 0) && (
          <div className="mt-3 flex gap-6 border-y border-[var(--border)] py-3 text-[14px] text-[var(--muted)]">
            {likesList.length > 0 && (
              <span>
                <strong className="font-bold text-[var(--text)]">
                  {likesList.length}
                </strong>{' '}
                {likesList.length === 1 ? 'Like' : 'Likes'}
              </span>
            )}
            {comments.length > 0 && (
              <span>
                <strong className="font-bold text-[var(--text)]">
                  {comments.length}
                </strong>{' '}
                {comments.length === 1 ? 'Reply' : 'Replies'}
              </span>
            )}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-around border-b border-[var(--border)] py-2 text-[var(--muted)]">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
            title="Reply"
          >
            <MessageCircle className="h-5 w-5 stroke-[1.75]" />
          </button>
          <button
            type="button"
            onClick={() => setHasReposted((prev) => !prev)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 ${
              hasReposted
                ? 'text-[#00ba7c]'
                : 'hover:bg-[rgba(0,186,124,0.1)] hover:text-[#00ba7c]'
            }`}
            title="Repost"
          >
            <Repeat2 className="h-5 w-5 stroke-[1.75]" />
          </button>
          <button
            type="button"
            onClick={handleLike}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 ${
              hasLiked
                ? 'text-[var(--accent)]'
                : 'hover:bg-[var(--accent-light)] hover:text-[var(--accent)]'
            }`}
            title="Like"
          >
            <Heart
              className={`h-5 w-5 stroke-[1.75] ${
                hasLiked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''
              }`}
            />
          </button>
          <button
            type="button"
            onClick={handleBookmark}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 ${
              isBookmarked
                ? 'text-[var(--accent)]'
                : 'hover:bg-[var(--accent-light)] hover:text-[var(--accent)]'
            }`}
            title="Bookmark"
          >
            <Bookmark
              className={`h-5 w-5 stroke-[1.75] ${
                isBookmarked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''
              }`}
            />
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
            title="Share"
          >
            <Share className="h-5 w-5 stroke-[1.75]" />
          </button>
        </div>

        {/* Reply composer */}
        <form onSubmit={handleReplySubmit} className="mt-4 flex gap-3">
          <Avatar src={user?.avatar} name={user?.username} size="md" className="shrink-0" />
          <div className="flex-1 min-w-0">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Post your reply"
              className="w-full resize-none bg-transparent text-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none"
            />
            <div className="flex justify-end pt-2">
              <ActionButton
                type="submit"
                variant="primary"
                size="sm"
                pill
                disabled={!replyText.trim() || isSubmittingReply}
                loading={isSubmittingReply}
              >
                Reply
              </ActionButton>
            </div>
          </div>
        </form>
      </article>

      {/* Replies list */}
      <section>
        {comments.length > 0 ? (
          comments.map((comment, index) => {
            const cUser = comment.user || {}
            const cUsername = cUser.username || 'User'
            const cId = cUser._id || cUser.id
            return (
              <div
                key={comment._id || index}
                className="flex gap-3 border-b border-[var(--border)] p-4 bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors duration-150"
              >
                <Avatar
                  src={cUser.avatar}
                  name={cUsername}
                  size="md"
                  onClick={() => {
                    if (cId === currentUserId) navigate('/profile')
                    else if (cId) navigate(`/users/${cId}`)
                  }}
                />
                <div className="flex-1 min-w-0 text-[15px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      onClick={() => {
                        if (cId === currentUserId) navigate('/profile')
                        else if (cId) navigate(`/users/${cId}`)
                      }}
                      className="font-bold text-[var(--text)] hover:underline cursor-pointer"
                    >
                      {cUsername}
                    </span>
                    <span className="text-[13px] text-[var(--muted)]">
                      · {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-[var(--text)] font-normal leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center text-[var(--muted)]">
            <p className="text-[15px] font-bold text-[var(--text)]">No replies yet</p>
            <p className="mt-1 text-[13px]">Be the first to join the conversation.</p>
          </div>
        )}
      </section>

      {/* Edit Post Modal */}
      <EditPopup
        post={post}
        isOpen={isEditOpen}
        isSaving={isSavingEdit}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />
    </MainLayout>
  )
}

export default PostDetailPage
