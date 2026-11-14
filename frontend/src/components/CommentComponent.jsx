import React, { useState } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import Avatar from './Avatar'
import { formatRelativeTime } from './common/PostCard'

const CommentComponent = ({
  comments = [],
  postId,
  currentUser,
  draftComment,
  onCommentChange,
  onCommentSubmit,
  onOpenUserProfile,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const currentUserId = (currentUser?._id || currentUser?.id)?.toString()

  return (
    <div className="border-t border-[var(--border)] pt-3 text-[14px]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-150"
        >
          <MessageCircle className="h-4 w-4" />
          <span>
            {comments.length > 0
              ? `${comments.length} ${comments.length === 1 ? 'reply' : 'replies'}`
              : 'Reply'}
          </span>
        </button>

        {comments.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150"
          >
            {isExpanded ? 'Hide' : 'Show all'}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Replies list */}
          {comments.length > 0 && (
            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {comments.map((comment, index) => {
                const commentUser = comment.user || {}
                const username = commentUser.username || 'user'
                const uid = commentUser._id || commentUser.id
                return (
                  <div
                    key={comment._id || index}
                    className="flex gap-2.5 rounded-[8px] p-2 hover:bg-[var(--surface-hover)] transition-colors duration-150"
                  >
                    <Avatar
                      src={commentUser.avatar}
                      name={username}
                      size="xs"
                      onClick={() => onOpenUserProfile && onOpenUserProfile(commentUser)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          onClick={() => onOpenUserProfile && onOpenUserProfile(commentUser)}
                          className="font-bold text-[var(--text)] hover:underline cursor-pointer"
                        >
                          {username}
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
          )}

          {/* New reply form */}
          <form
            onSubmit={(e) => onCommentSubmit(e, postId)}
            className="flex items-center gap-2 pt-1"
          >
            <Avatar src={currentUser?.avatar} name={currentUser?.username} size="sm" />
            <input
              type="text"
              value={draftComment}
              onChange={(e) => onCommentChange(e, postId)}
              placeholder="Post your reply"
              className="flex-1 rounded-full border border-[var(--border)] bg-transparent px-3.5 py-1.5 text-[14px] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draftComment?.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-text)] transition-colors duration-150 hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send reply"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default CommentComponent
