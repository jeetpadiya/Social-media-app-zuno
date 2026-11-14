import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // initialize token state from cookie
  const [token, setToken] = useState(!!Cookies.get('token'))
  const [user, setUser] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // keep axios Authorization header in sync whenever auth state changes
  useEffect(() => {
    const t = Cookies.get('token')
    if (t && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const fetchUnreadCount = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notifications`)
      if (data.success && typeof data.unreadCount === 'number') {
        setUnreadCount(data.unreadCount)
      }
    } catch (err) {
      // silent fail
    }
  }

  // fetch /api/user/me when token flips to true
  const fetchCurrentUserDetails = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/me`)
      if (data.success) {
        setUser(data.currentUser)
      }
    } catch (err) {
      console.error(err)
      toast.error('Session expired, please log in again.')
      handleLogout()
    }
  }

  useEffect(() => {
    if (token) {
      fetchCurrentUserDetails()
      fetchUnreadCount()
    }
  }, [token])

  // REGISTER
  const handleRegister = async (username, email, password, avatarFile) => {
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('image', avatarFile)

      const { data } = await axios.post(
        `${backendUrl}/api/user/register`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (data.success) {
        Cookies.set('token', data.token, { expires: 7 })
        setToken(true)
        setUser(data.user)
        toast.success(data.message || 'Registered successfully!')
        navigate('/posts')
      }
    } catch (err) {
      console.error('Registasion error:', err.response || err)
      toast.error(err.response?.data?.message || 'Registration failed.')
    }
  }

  // LOGIN
  const handleLogin = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (data.success) {
        Cookies.set('token', data.token, { expires: 7 })
        setToken(true)
        setUser(data.user)
        toast.success(data.message || 'Logged in successfully!')
        navigate('/posts')
      }
    } catch (err) {
      console.error(err)
      toast.error('Login failed.')
    }
  }


  //forgot password


  const searchUsers = async (query) => {
    try {
      const trimmedQuery = query?.trim()

      if (!trimmedQuery) {
        return []
      }

      const { data } = await axios.get(
        `${backendUrl}/api/user/search?username=${encodeURIComponent(trimmedQuery)}`
      )
      if (data.success) {
        return data.users
      }
    } catch (err) {
      console.error(err)
      toast.error('User search failed.')
    }
    return []
  }

  const updateUserProfile = async ({ username, email, bio, location, website, avatarFile }) => {
    try {
      const formData = new FormData()

      if (typeof username === 'string' && username.trim()) {
        formData.append('username', username.trim())
      }

      if (typeof email === 'string' && email.trim()) {
        formData.append('email', email.trim())
      }

      if (typeof bio === 'string') {
        formData.append('bio', bio.trim())
      }

      if (typeof location === 'string') {
        formData.append('location', location.trim())
      }

      if (typeof website === 'string') {
        formData.append('website', website.trim())
      }

      if (avatarFile) {
        formData.append('image', avatarFile)
      }

      const { data } = await axios.put(
        `${backendUrl}/api/user/me`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (data.success) {
        setUser(data.currentUser)
        toast.success(data.message || 'Profile updated successfully!')
        return true
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Profile update failed.')
    }

    return false
  }

  // LOGOUT
  const handleLogout = () => {
    Cookies.remove('token')
    delete axios.defaults.headers.common['Authorization']
    setToken(false)
    setUser(null)
    toast.success('Logged out.')
    navigate('/login')
  }

  const isUserFollowing = (targetUserId) => {
    if (!user || !targetUserId) return false
    const tid = (targetUserId?._id || targetUserId?.id || targetUserId)?.toString()
    return (user.following || []).some((item) => {
      const iid = (item?._id || item?.id || item)?.toString()
      return iid === tid
    })
  }

  const toggleFollow = async (targetUserId) => {
    const tid = (targetUserId?._id || targetUserId?.id || targetUserId)?.toString()
    const currentUserId = (user?._id || user?.id)?.toString()

    if (!currentUserId || !tid || currentUserId === tid) return { success: false }

    const alreadyFollowing = isUserFollowing(tid)
    const previousFollowing = user?.following || []

    const updatedFollowing = alreadyFollowing
      ? previousFollowing.filter((item) => {
          const iid = (item?._id || item?.id || item)?.toString()
          return iid !== tid
        })
      : [...previousFollowing, tid]

    setUser((prev) => (prev ? { ...prev, following: updatedFollowing } : prev))

    try {
      const { data } = await axios.put(`${backendUrl}/api/user/${tid}/follow`)
      if (data.success) {
        toast.success(data.message)
        if (Array.isArray(data.currentUserFollowing)) {
          setUser((prev) => (prev ? { ...prev, following: data.currentUserFollowing } : prev))
        }
        return {
          success: true,
          isFollowing: data.isFollowing,
          followersCount: data.followersCount,
        }
      }
    } catch (err) {
      setUser((prev) => (prev ? { ...prev, following: previousFollowing } : prev))
      toast.error(err.response?.data?.message || 'Failed to update follow.')
    }
    return { success: false, isFollowing: alreadyFollowing }
  }

  const isPostBookmarked = (postId) => {
    if (!user || !postId) return false
    const pid = (postId?._id || postId?.id || postId)?.toString()
    return (user.bookmarks || []).some((item) => {
      const iid = (item?._id || item?.id || item)?.toString()
      return iid === pid
    })
  }

  const toggleBookmark = async (postId) => {
    const pid = (postId?._id || postId?.id || postId)?.toString()
    if (!user || !pid) return { success: false }

    const alreadyBookmarked = isPostBookmarked(pid)
    const previousBookmarks = user?.bookmarks || []

    const updatedBookmarks = alreadyBookmarked
      ? previousBookmarks.filter((item) => {
          const iid = (item?._id || item?.id || item)?.toString()
          return iid !== pid
        })
      : [...previousBookmarks, pid]

    setUser((prev) => (prev ? { ...prev, bookmarks: updatedBookmarks } : prev))

    try {
      const { data } = await axios.put(`${backendUrl}/api/posts/posts/${pid}/bookmark`)
      if (data.success) {
        toast.success(data.message)
        if (Array.isArray(data.bookmarks)) {
          setUser((prev) => (prev ? { ...prev, bookmarks: data.bookmarks } : prev))
        }
        return { success: true, isBookmarked: data.isBookmarked }
      }
    } catch (err) {
      setUser((prev) => (prev ? { ...prev, bookmarks: previousBookmarks } : prev))
      toast.error(err.response?.data?.message || 'Failed to update bookmark.')
    }
    return { success: false, isBookmarked: alreadyBookmarked }
  }

  const value = {
    backendUrl,
    token,
    user,
    unreadCount,
    setUnreadCount,
    fetchUnreadCount,
    handleRegister,
    handleLogin,
    updateUserProfile,
    searchUsers,
    handleLogout,
    isUserFollowing,
    toggleFollow,
    isPostBookmarked,
    toggleBookmark,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
