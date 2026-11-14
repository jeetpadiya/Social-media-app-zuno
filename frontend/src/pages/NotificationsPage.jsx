import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  CheckCheck,
  Inbox,
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import MainLayout from '../components/MainLayout'
import Avatar from '../components/Avatar'
import ActionButton from '../components/ActionButton'
import Skeleton from '../components/Skeleton'

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

const NotificationsPage = () => {
  const navigate = useNavigate()
  const { backendUrl, isUserFollowing, toggleFollow, setUnreadCount } = useContext(AuthContext)

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'unread'
  const [markingRead, setMarkingRead] = useState(false)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/notifications`)
      if (data.success) {
        setNotifications(Array.isArray(data.notifications) ? data.notifications : [])
        if (typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount)
        }
      }
    } catch (err) {
      console.error('Fetch notifications error:', err)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingRead(true)
      const { data } = await axios.put(`${backendUrl}/api/notifications/read`)
      if (data.success) {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
        setUnreadCount(0)
        toast.success('All notifications marked as read')
      }
    } catch (err) {
      console.error('Mark read error:', err)
      toast.error('Failed to mark notifications as read')
    } finally {
      setMarkingRead(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayedNotifications =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications

  const renderIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 fill-[#f91880] text-[#f91880]" />
      case 'comment':
        return <MessageCircle className="h-5 w-5 fill-[var(--accent)] text-[var(--accent)]" />
      case 'follow':
        return <UserPlus className="h-5 w-5 fill-[var(--accent)] text-[var(--accent)]" />
      default:
        return <Bell className="h-5 w-5 text-[var(--accent)]" />
    }
  }

  return (
    <MainLayout title="Notifications">
      {/* Top sticky header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-[19px] font-bold text-[var(--text)]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex h-5 items-center justify-center rounded-full bg-[var(--accent)] px-2 text-[12px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markingRead}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-[var(--accent)] transition-colors duration-150 hover:bg-[var(--accent-hover)]"
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Tab switcher: All vs Unread */}
        <div className="grid grid-cols-2 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`relative py-3.5 text-center text-[15px] font-semibold transition-colors duration-150 hover:bg-[var(--surface-hover)] ${
              activeTab === 'all'
                ? 'text-[var(--text)]'
                : 'text-[var(--muted)]'
            }`}
          >
            All
            {activeTab === 'all' && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={`relative py-3.5 text-center text-[15px] font-semibold transition-colors duration-150 hover:bg-[var(--surface-hover)] ${
              activeTab === 'unread'
                ? 'text-[var(--text)]'
                : 'text-[var(--muted)]'
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
            {activeTab === 'unread' && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
            )}
          </button>
        </div>
      </header>

      {/* Main content list */}
      {loading ? (
        <div className="divide-y divide-[var(--border)]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 p-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--muted)] mb-4">
            <Inbox className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h2 className="text-[18px] font-bold text-[var(--text)]">
            {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h2>
          <p className="mt-1 max-w-xs text-[14px] text-[var(--muted)]">
            {activeTab === 'unread'
              ? 'You have caught up with all your latest activities.'
              : 'When people like your posts, comment, or follow you, you’ll see them right here.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {displayedNotifications.map((item) => {
            const sender = item.sender || {}
            const senderId = sender._id || sender.id
            const senderName = sender.username || 'User'
            const senderHandle = `@${senderName.toLowerCase().replace(/\s+/g, '')}`
            const post = item.post
            const postId = post?._id || post?.id
            const isFollowingSender = isUserFollowing(senderId)

            const handleNotificationClick = () => {
              if (item.type === 'follow' && senderId) {
                navigate(`/users/${senderId}`)
              } else if (postId) {
                navigate(`/posts/${postId}`)
              } else if (senderId) {
                navigate(`/users/${senderId}`)
              }
            }

            return (
              <article
                key={item._id}
                onClick={handleNotificationClick}
                className={`group flex cursor-pointer gap-3.5 p-4 transition-colors duration-150 hover:bg-[var(--surface-hover)] ${
                  !item.read ? 'bg-[var(--accent)]/[0.04]' : 'bg-[var(--surface)]'
                }`}
              >
                {/* Type Icon */}
                <div className="pt-1 shrink-0">
                  {renderIcon(item.type)}
                </div>

                {/* Main Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    {/* User info row */}
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (senderId) navigate(`/users/${senderId}`)
                        }}
                        className="shrink-0 transition-opacity duration-150 hover:opacity-85"
                      >
                        <Avatar src={sender.avatar} name={senderName} size="md" />
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (senderId) navigate(`/users/${senderId}`)
                            }}
                            className="font-bold text-[15px] text-[var(--text)] hover:underline truncate"
                          >
                            {senderName}
                          </button>
                          <span className="text-[14px] text-[var(--muted)] truncate">
                            {senderHandle}
                          </span>
                          <span className="text-[14px] text-[var(--muted)]">·</span>
                          <span className="text-[13px] text-[var(--muted)] shrink-0">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Unread indicator or Follow button */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.type === 'follow' && senderId && (
                        <ActionButton
                          variant={isFollowingSender ? 'secondary' : 'primary'}
                          size="sm"
                          pill
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFollow(senderId)
                          }}
                        >
                          {isFollowingSender ? 'Following' : 'Follow back'}
                        </ActionButton>
                      )}
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      )}
                    </div>
                  </div>

                  {/* Notification text / details */}
                  <div className="mt-1.5 text-[15px] text-[var(--text)]">
                    {item.type === 'like' && (
                      <p className="text-[var(--muted)]">
                        liked your post
                      </p>
                    )}
                    {item.type === 'comment' && (
                      <p className="text-[var(--text)]">
                        replied: <span className="text-[var(--text)] font-normal italic">"{item.text || '...'}"</span>
                      </p>
                    )}
                    {item.type === 'follow' && (
                      <p className="text-[var(--muted)]">
                        started following you
                      </p>
                    )}
                  </div>

                  {/* Post preview snippet if applicable */}
                  {post && (
                    <div className="mt-2.5 flex items-center gap-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-2.5 transition-colors duration-150 group-hover:border-[var(--border-strong)]">
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post preview"
                          className="h-12 w-12 rounded-[6px] object-cover shrink-0"
                        />
                      )}
                      <p className="line-clamp-2 text-[13px] text-[var(--muted)] font-normal">
                        {post.text || 'Media post'}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </MainLayout>
  )
}

export default NotificationsPage