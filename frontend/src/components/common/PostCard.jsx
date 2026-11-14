import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
import Avatar from './Avatar'
import ImageLightbox from './ImageLightbox'
import { AuthContext } from '../../context/AuthContext'
import { PostContext } from '../../context/PostContext'
import { toast } from 'sonner'

export const formatRelativeTime = (timestamp) => {
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

const PostCard = ({
  post,
  onEdit,
  isOwner = false,
}) => {
  const navigate = useNavigate()
  const { user, isPostBookmarked, toggleBookmark } = useContext(AuthContext)
  const { likePosts, deltePosts, postsComments } = useContext(PostContext)

  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [repostCount, setRepostCount] = useState(0)
  const [hasReposted, setHasReposted] = useState(false)

  const isBookmarked = isPostBookmarked(post?._id)

  const currentUserId = (user?._id || user?.id)?.toString()
  const postAuthor = post?.user || {}
  const authorId = (postAuthor._id || postAuthor.id)?.toString()
  const isPostOwner = isOwner || (currentUserId && authorId && currentUserId === authorId)

  const likesList = Array.isArray(post?.likes) ? post.likes : []
  const hasLiked = likesList.some((likedUser) => {
    const id = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
    return id?.toString() === currentUserId
  })

  const openAuthorProfile = (e) => {
    e?.stopPropagation()
    if (!authorId) return
    if (authorId === currentUserId) {
      navigate('/profile')
    } else {
      navigate(`/users/${authorId}`)
    }
  }

  const handleLike = (e) => {
    e.stopPropagation()
    if (post?._id) {
      likePosts(post._id)
    }
  }

  const handleRepost = (e) => {
    e.stopPropagation()
    setHasReposted((prev) => !prev)
    setRepostCount((prev) => (hasReposted ? Math.max(0, prev - 1) : prev + 1))
    toast.success(hasReposted ? 'Repost removed' : 'Reposted to your feed')
  }

  const handleBookmark = async (e) => {
    e.stopPropagation()
    if (post?._id) {
      await toggleBookmark(post._id)
    }
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    const url = window.location.origin + `/posts`
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      toast.success('Post link copied to clipboard')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    const text = commentText.trim()
    if (!text || isSubmittingComment) return

    setIsSubmittingComment(true)
    const success = await postsComments(post._id, text)
    setIsSubmittingComment(false)
    if (success) {
      setCommentText('')
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    if (window.confirm('Delete this post?')) {
      deltePosts(post._id)
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    if (onEdit) {
      onEdit(post)
    }
  }

  const handlePostClick = () => {
    if (post?._id) {
      navigate(`/posts/${post._id}`)
    }
  }

  const username = postAuthor?.username || 'user'
  const handle = `@${username.toLowerCase().replace(/\s+/g, '')}`
  const comments = Array.isArray(post?.comments) ? post.comments : []

  return (
    <article
      onClick={handlePostClick}
      className="group relative flex border-b border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 transition-colors duration-150 hover:bg-[var(--surface-hover)] cursor-pointer"
    >
      {/* Left: Avatar */}
      <div className="mr-3 shrink-0">
        <Avatar
          src={postAuthor?.avatar}
          name={username}
          size="md"
          onClick={openAuthorProfile}
        />
      </div>

      {/* Right: Content & Actions */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 truncate">
            <span
              onClick={openAuthorProfile}
              className="truncate font-bold text-[var(--text)] hover:underline cursor-pointer"
            >
              {username}
            </span>
            <span
              onClick={openAuthorProfile}
              className="truncate text-[14px] text-[var(--muted)] font-normal hover:underline cursor-pointer"
            >
              {handle}
            </span>
            <span className="text-[14px] text-[var(--muted)]">·</span>
            <span className="whitespace-nowrap text-[14px] text-[var(--muted)] hover:underline">
              {formatRelativeTime(post?.createdAt)}
            </span>
          </div>

          {/* Options button */}
          {isPostOwner && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu((prev) => !prev)
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-8 z-30 min-w-[140px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-1 text-[14px] shadow-none"
                >
                  {onEdit && (
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left font-semibold text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
                    >
                      <Edit3 className="h-4 w-4 text-[var(--muted)]" />
                      <span>Edit</span>
                    </button>
                  )}
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

        {/* Text content */}
        {post?.text && (
          <p className="mt-1 whitespace-pre-wrap break-words text-[15px] font-normal leading-normal text-[var(--text)]">
            {post.text}
          </p>
        )}

        {/* Media */}
        {post?.image && (
          <>
            <div
              onClick={(e) => {
                e.stopPropagation()
                setIsLightboxOpen(true)
              }}
              className="mt-3 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-hover)] cursor-pointer"
            >
              <img
                src={post.image}
                alt="Post attachment"
                className="max-h-[500px] w-full object-cover transition-opacity duration-150 hover:opacity-95"
                loading="lazy"
              />
            </div>
            <ImageLightbox
              src={post.image}
              isOpen={isLightboxOpen}
              onClose={() => setIsLightboxOpen(false)}
            />
          </>
        )}

        {/* Action row: comment, repost, like, bookmark */}
        <div className="mt-3 flex items-center justify-between text-[var(--muted)]">
          {/* Comment */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowComments((prev) => !prev)
            }}
            className="group/act flex items-center gap-1.5 transition-colors duration-150 hover:text-[var(--accent)]"
            title="Reply"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 group-hover/act:bg-[var(--accent-light)]">
              <MessageCircle className="h-[18px] w-[18px] stroke-[1.75]" />
            </div>
            <span className="text-[13px] font-normal">
              {comments.length > 0 ? comments.length : ''}
            </span>
          </button>

          {/* Repost */}
          <button
            type="button"
            onClick={handleRepost}
            className={`group/act flex items-center gap-1.5 transition-colors duration-150 ${
              hasReposted
                ? 'text-[#00ba7c]'
                : 'hover:text-[#00ba7c]'
            }`}
            title="Repost"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 group-hover/act:bg-[rgba(0,186,124,0.1)]">
              <Repeat2 className="h-[18px] w-[18px] stroke-[1.75]" />
            </div>
            <span className="text-[13px] font-normal">
              {repostCount > 0 ? repostCount : ''}
            </span>
          </button>

          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className={`group/act flex items-center gap-1.5 transition-colors duration-150 ${
              hasLiked
                ? 'text-[var(--accent)]'
                : 'hover:text-[var(--accent)]'
            }`}
            title="Like"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 group-hover/act:bg-[var(--accent-light)]">
              <Heart
                className={`h-[18px] w-[18px] stroke-[1.75] ${
                  hasLiked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''
                }`}
              />
            </div>
            <span className={`text-[13px] ${hasLiked ? 'font-semibold text-[var(--accent)]' : 'font-normal'}`}>
              {likesList.length > 0 ? likesList.length : ''}
            </span>
          </button>

          {/* Bookmark / Share */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleBookmark}
              className={`group/act flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 ${
                isBookmarked
                  ? 'text-[var(--accent)]'
                  : 'hover:bg-[var(--accent-light)] hover:text-[var(--accent)]'
              }`}
              title="Bookmark"
            >
              <Bookmark
                className={`h-[18px] w-[18px] stroke-[1.75] ${
                  isBookmarked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''
                }`}
              />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="group/act flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 hover:bg-[var(--accent-light)] hover:text-[var(--accent)]"
              title="Share"
            >
              <Share className="h-[17px] w-[17px] stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Expandable comments section */}
        {showComments && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 border-t border-[var(--border)] pt-3"
          >
            {/* Comment input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <Avatar src={user?.avatar} name={user?.username} size="sm" />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Post your reply"
                className="flex-1 rounded-full border border-[var(--border)] bg-transparent px-3.5 py-1.5 text-[14px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-text)] transition-colors duration-150 hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send reply"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Comment list */}
            {comments.length > 0 ? (
              <div className="mt-3 space-y-2.5">
                {comments.map((comment, index) => {
                  const commentAuthor = comment.user || {}
                  const cUsername = commentAuthor.username || 'user'
                  const cAuthorId = commentAuthor._id || commentAuthor.id
                  return (
                    <div
                      key={comment._id || index}
                      className="flex gap-2.5 rounded-[8px] p-2 hover:bg-[var(--surface-hover)] transition-colors duration-150"
                    >
                      <Avatar
                        src={commentAuthor.avatar}
                        name={cUsername}
                        size="xs"
                        onClick={() => {
                          if (cAuthorId === currentUserId) navigate('/profile')
                          else if (cAuthorId) navigate(`/users/${cAuthorId}`)
                        }}
                      />
                      <div className="flex-1 min-w-0 text-[14px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            onClick={() => {
                              if (cAuthorId === currentUserId) navigate('/profile')
                              else if (cAuthorId) navigate(`/users/${cAuthorId}`)
                            }}
                            className="font-bold text-[var(--text)] hover:underline cursor-pointer"
                          >
                            {cUsername}
                          </span>
                          <span className="text-[12px] text-[var(--muted)]">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[var(--text)] font-normal leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 text-center text-[13px] text-[var(--muted)]">
                No replies yet. Start the conversation.
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard
