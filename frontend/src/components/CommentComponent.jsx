import { useState } from 'react'
import { IoSend } from 'react-icons/io5'

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now'

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000))

  if (diffInSeconds < 60) return 'Just now'

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ]

  for (const interval of intervals) {
    const value = Math.floor(diffInSeconds / interval.seconds)
    if (value >= 1) return `${value}${interval.label} ago`
  }

  return 'Just now'
}

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

  return (
    <>
      <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-white">Comments</p>
            <p className="mt-1 text-sm text-slate-400">
              {comments.length > 0 ? `${comments.length} comments on this post` : 'No comments yet'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {isExpanded ? 'Hide Comments' : `Show Comments${comments.length ? ` (${comments.length})` : ''}`}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="thin-scrollbar max-h-52 space-y-3 overflow-y-auto pr-1">
              {comments.slice(0, 3).map((comment, index) => (
                <div key={index} className="rounded-[22px] border border-white/8 bg-[#0a1728] p-3">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-2xl bg-white/10">
                      <img
                        src={comment.user?.avatar ?? ""}
                        alt={comment.user?.username || "Comment user"}
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={() => onOpenUserProfile(comment.user)}
                      />
                    </div>
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenUserProfile(comment.user)}
                        className="truncate text-left text-sm font-semibold text-white transition hover:text-sky-300"
                      >
                        {comment.user?.username || "Unknown user"}
                      </button>
                      <p className="text-xs text-gray-300">
                        {formatTimeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="pl-12 text-sm leading-6 text-gray-100">
                    {comment.text}
                  </p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="rounded-xl bg-black/10 px-3 py-3 text-sm text-gray-300">
                  No comments yet. Be the first to say something.
                </p>
              )}
            </div>

            <form onSubmit={(event) => onCommentSubmit(event, postId)} className="flex items-center gap-2 text-black">
              <div className="hidden h-10 w-10 overflow-hidden rounded-2xl bg-gray-200 md:block">
                <img src={currentUser?.avatar ?? ""} alt="User Avatar" className="h-full w-full object-cover" />
              </div>
              <input
                type="text"
                value={draftComment}
                onChange={(event) => onCommentChange(event, postId)}
                name="text"
                placeholder="Write your comment"
                className="flex-1 rounded-full border border-white/10 bg-[#f8fafc] px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />

              <div className="flex space-x-2">
                <button type="submit" className="accent-button rounded-full p-3 text-xl text-white transition" title="Post Comment">
                  <IoSend className="cursor-pointer" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default CommentComponent
