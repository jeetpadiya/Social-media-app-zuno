import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, TrendingUp } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { PostContext } from '../context/PostContext'
import Avatar from './Avatar'
import ActionButton from './ActionButton'

const RightSidebar = () => {
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const { user, searchUsers } = useContext(AuthContext)
  const { Allposts } = useContext(PostContext)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [followedUsers, setFollowedUsers] = useState({})

  const currentUserId = (user?._id || user?.id)?.toString()

  // Extract unique suggested creators from posts
  const suggestedUsers = React.useMemo(() => {
    const map = new Map()
    if (Array.isArray(Allposts)) {
      for (const p of Allposts) {
        const u = p?.user
        const uid = (u?._id || u?.id)?.toString()
        if (uid && uid !== currentUserId && !map.has(uid) && u?.username) {
          map.set(uid, u)
        }
        if (map.size >= 3) break
      }
    }
    return Array.from(map.values())
  }, [Allposts, currentUserId])

  // Debounced search
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    let isCancelled = false
    const timer = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchUsers(trimmed)
      if (!isCancelled) {
        setSearchResults(Array.isArray(results) ? results : [])
        setShowDropdown(true)
        setIsSearching(false)
      }
    }, 250)

    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [searchQuery, searchUsers])

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpenUser = (targetUserId) => {
    setSearchQuery('')
    setShowDropdown(false)
    if (targetUserId?.toString() === currentUserId) {
      navigate('/profile')
    } else {
      navigate(`/users/${targetUserId}`)
    }
  }

  const toggleFollow = (uid, e) => {
    e.stopPropagation()
    setFollowedUsers((prev) => ({
      ...prev,
      [uid]: !prev[uid],
    }))
  }

  const trends = [
    { category: 'Technology · Trending', topic: '#React19', posts: '42.8K' },
    { category: 'Design · Trending', topic: '#FlatUI', posts: '18.4K' },
    { category: 'Social · Trending', topic: '#ZunoCommunity', posts: '9.2K' },
    { category: 'Photography · Trending', topic: '#Minimalism', posts: '31.1K' },
  ]

  const filteredSearchResults = searchResults.filter(
    (u) => (u._id || u.id)?.toString() !== currentUserId
  )

  return (
    <aside className="sticky top-0 hidden h-screen w-[290px] xl:w-[350px] flex-col gap-4 overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-3 lg:flex">
      {/* Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-hover)] px-4 py-2.5 transition-colors duration-150 focus-within:border-[var(--accent)] focus-within:bg-[var(--surface)]">
          <Search className="h-4 w-4 shrink-0 text-[var(--muted)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setShowDropdown(true)
            }}
            placeholder="Search"
            className="w-full bg-transparent text-[14px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--bg)] hover:opacity-80"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Search dropdown results */}
        {showDropdown && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-none">
            {isSearching ? (
              <p className="p-3 text-center text-[13px] text-[var(--muted)]">
                Searching users...
              </p>
            ) : filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((userItem) => {
                const uid = userItem._id || userItem.id
                const uName = userItem.username || 'user'
                const uHandle = `@${uName.toLowerCase().replace(/\s+/g, '')}`
                return (
                  <button
                    key={uid}
                    type="button"
                    onClick={() => handleOpenUser(uid)}
                    className="flex w-full items-center gap-3 rounded-[8px] p-2.5 text-left transition-colors duration-150 hover:bg-[var(--surface-hover)]"
                  >
                    <Avatar src={userItem.avatar} name={uName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-[var(--text)]">
                        {uName}
                      </p>
                      <p className="truncate text-[13px] text-[var(--muted)]">
                        {uHandle}
                      </p>
                    </div>
                  </button>
                )
              })
            ) : (
              <p className="p-3 text-center text-[13px] text-[var(--muted)]">
                No users found for "{searchQuery}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Suggested Users / Who to follow */}
      {suggestedUsers.length > 0 && (
        <section className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-3">
          <h2 className="mb-2 text-[16px] font-bold text-[var(--text)]">
            Who to follow
          </h2>
          <div className="space-y-1">
            {suggestedUsers.map((su) => {
              const uid = su._id || su.id
              const suName = su.username || 'user'
              const suHandle = `@${suName.toLowerCase().replace(/\s+/g, '')}`
              const isFollowing = !!followedUsers[uid]

              return (
                <div
                  key={uid}
                  onClick={() => handleOpenUser(uid)}
                  className="flex items-center justify-between gap-2 rounded-[8px] p-2 transition-colors duration-150 hover:bg-[var(--surface-hover)] cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar src={su.avatar} name={suName} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-[var(--text)] hover:underline">
                        {suName}
                      </p>
                      <p className="truncate text-[12px] text-[var(--muted)]">
                        {suHandle}
                      </p>
                    </div>
                  </div>
                  <ActionButton
                    variant={isFollowing ? 'secondary' : 'dark'}
                    size="sm"
                    pill
                    onClick={(e) => toggleFollow(uid, e)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </ActionButton>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* What's happening / Trends */}
      <section className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-3">
        <h2 className="mb-2 text-[16px] font-bold text-[var(--text)]">
          What's happening
        </h2>
        <div className="space-y-1">
          {trends.map((trend) => (
            <div
              key={trend.topic}
              className="rounded-[8px] p-2 transition-colors duration-150 hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              <p className="text-[12px] text-[var(--muted)] font-normal">
                {trend.category}
              </p>
              <p className="text-[14px] font-bold text-[var(--text)]">
                {trend.topic}
              </p>
              <p className="text-[12px] text-[var(--muted)] font-normal">
                {trend.posts} posts
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer links */}
      <footer className="px-2 text-[12px] text-[var(--muted)] leading-relaxed space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Cookie Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Accessibility</span>
        </div>
        <p>© 2026 Zuno, Inc.</p>
      </footer>
    </aside>
  )
}

export default RightSidebar
