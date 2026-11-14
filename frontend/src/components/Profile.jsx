import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Grid,
  List,
  LogOut,
  Mail,
  MoreHorizontal,
  Trash2,
  Edit3,
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { PostContext } from '../context/PostContext'
import Avatar from './Avatar'
import ActionButton from './ActionButton'
import PostCard from './PostCard'
import EditPopup from '../popups/EditPopup'
import EditProfilePopup from '../popups/EditProfilePopup'

const Profile = ({ profileUser, posts, isOwnProfile = true }) => {
  const navigate = useNavigate()
  const { user, handleLogout, updateUserProfile } = useContext(AuthContext)
  const { userPosts, deltePosts, UpdatePosts } = useContext(PostContext)

  const displayUser = profileUser || user
  const safeUserPosts = Array.isArray(posts)
    ? posts
    : Array.isArray(userPosts)
    ? userPosts
    : []

  const [activeTab, setActiveTab] = useState('posts')
  const [viewMode, setViewMode] = useState('list') // 'list' | 'grid'
  const [isFollowing, setIsFollowing] = useState(false)

  // Edit popups state
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

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

  const handleSaveProfile = async (updates) => {
    setIsSavingProfile(true)
    const saved = await updateUserProfile(updates)
    setIsSavingProfile(false)
    return saved
  }

  if (!displayUser) {
    return (
      <div className="p-8 text-center text-[var(--muted)]">
        Loading profile...
      </div>
    )
  }

  const username = displayUser.username || 'User'
  const handle = `@${username.toLowerCase().replace(/\s+/g, '')}`

  const mediaPosts = safeUserPosts.filter((p) => !!p.image)

  return (
    <div className="bg-[var(--surface)] text-[var(--text)]">
      {/* Popups */}
      <EditProfilePopup
        user={displayUser}
        isOpen={isProfileEditOpen}
        isSaving={isSavingProfile}
        onClose={() => setIsProfileEditOpen(false)}
        onSave={handleSaveProfile}
      />
      <EditPopup
        post={selectedPost}
        isOpen={isEditOpen}
        isSaving={isSavingEdit}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 flex items-center gap-6 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-2 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate('/posts')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[18px] font-bold text-[var(--text)]">
            {username}
          </h1>
          <p className="text-[13px] text-[var(--muted)] font-normal">
            {safeUserPosts.length} {safeUserPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

      {/* Cover banner */}
      <div className="h-32 sm:h-44 w-full border-b border-[var(--border)] bg-[var(--surface-hover)]" />

      {/* Profile info section */}
      <div className="px-4 pb-4">
        {/* Avatar + Action buttons row */}
        <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-4">
          <div className="relative">
            <Avatar
              src={displayUser.avatar}
              name={username}
              size="2xl"
              className="border-4 border-[var(--bg)]"
            />
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <>
                <ActionButton
                  variant="secondary"
                  size="sm"
                  pill
                  onClick={() => setIsProfileEditOpen(true)}
                >
                  Edit profile
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  size="sm"
                  pill
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </ActionButton>
              </>
            ) : (
              <ActionButton
                variant={isFollowing ? 'secondary' : 'dark'}
                size="sm"
                pill
                onClick={() => setIsFollowing((prev) => !prev)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </ActionButton>
            )}
          </div>
        </div>

        {/* Username & Handle */}
        <div>
          <h2 className="text-[20px] font-bold text-[var(--text)] leading-tight">
            {username}
          </h2>
          <p className="text-[14px] text-[var(--muted)] font-normal">{handle}</p>
        </div>

        {/* Bio / Info */}
        <div className="mt-3 flex flex-wrap gap-y-1 gap-x-4 text-[14px] text-[var(--muted)]">
          {displayUser.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 shrink-0 stroke-[1.75]" />
              <span>{displayUser.email}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 shrink-0 stroke-[1.75]" />
            <span>Joined 2026</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-5 text-[14px]">
          <span className="text-[var(--text)] font-normal">
            <strong className="font-bold">{safeUserPosts.length}</strong>{' '}
            <span className="text-[var(--muted)]">Posts</span>
          </span>
          <span className="text-[var(--text)] font-normal">
            <strong className="font-bold">142</strong>{' '}
            <span className="text-[var(--muted)]">Following</span>
          </span>
          <span className="text-[var(--text)] font-normal">
            <strong className="font-bold">1.2K</strong>{' '}
            <span className="text-[var(--muted)]">Followers</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-y border-[var(--border)] px-2">
        <div className="flex flex-1">
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className="relative flex flex-1 items-center justify-center py-3 text-[15px] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          >
            <span
              className={`${
                activeTab === 'posts'
                  ? 'font-bold text-[var(--text)]'
                  : 'font-normal text-[var(--muted)]'
              }`}
            >
              Posts
            </span>
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 h-1 w-12 rounded-full bg-[var(--accent)]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className="relative flex flex-1 items-center justify-center py-3 text-[15px] transition-colors duration-150 hover:bg-[var(--surface-hover)]"
          >
            <span
              className={`${
                activeTab === 'media'
                  ? 'font-bold text-[var(--text)]'
                  : 'font-normal text-[var(--muted)]'
              }`}
            >
              Media
            </span>
            {activeTab === 'media' && (
              <div className="absolute bottom-0 h-1 w-12 rounded-full bg-[var(--accent)]" />
            )}
          </button>
        </div>

        {/* View mode toggle (list or grid) */}
        <div className="flex items-center gap-1 border-l border-[var(--border)] pl-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 ${
              viewMode === 'list'
                ? 'text-[var(--accent)] bg-[var(--accent-light)]'
                : 'text-[var(--muted)] hover:bg-[var(--surface-hover)]'
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 ${
              viewMode === 'grid'
                ? 'text-[var(--accent)] bg-[var(--accent-light)]'
                : 'text-[var(--muted)] hover:bg-[var(--surface-hover)]'
            }`}
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Posts Content */}
      {viewMode === 'list' ? (
        <div>
          {(activeTab === 'posts' ? safeUserPosts : mediaPosts).length > 0 ? (
            (activeTab === 'posts' ? safeUserPosts : mediaPosts).map((post) => (
              <PostCard
                key={post._id}
                post={{ ...post, user: displayUser }}
                isOwner={isOwnProfile}
                onEdit={handleEditPost}
              />
            ))
          ) : (
            <div className="p-12 text-center text-[var(--muted)]">
              <p className="text-[16px] font-bold text-[var(--text)]">No posts shared yet</p>
              <p className="mt-1 text-[14px]">
                {isOwnProfile
                  ? "When you post updates or photos, they'll show up here."
                  : 'This user has not posted anything yet.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-3 gap-1 p-1">
          {(activeTab === 'posts' ? safeUserPosts : mediaPosts).map((post) => (
            <div
              key={post._id}
              onClick={() => handleEditPost(post)}
              className="group relative aspect-square overflow-hidden bg-[var(--surface-hover)] cursor-pointer"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt="Post"
                  className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-3 text-center text-[13px] text-[var(--muted)]">
                  {post.text || 'Post'}
                </div>
              )}
            </div>
          ))}
          {(activeTab === 'posts' ? safeUserPosts : mediaPosts).length === 0 && (
            <div className="col-span-3 p-12 text-center text-[var(--muted)]">
              <p className="text-[16px] font-bold text-[var(--text)]">No media found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
