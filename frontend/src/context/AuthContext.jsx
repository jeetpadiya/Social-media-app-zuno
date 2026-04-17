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

  // keep axios Authorization header in sync whenever auth state changes
  useEffect(() => {
    const t = Cookies.get('token')
    if (t && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

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

  const updateUserProfile = async ({ username, email, avatarFile }) => {
    try {
      const formData = new FormData()

      if (typeof username === 'string' && username.trim()) {
        formData.append('username', username.trim())
      }

      if (typeof email === 'string' && email.trim()) {
        formData.append('email', email.trim())
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

  const value = {
    backendUrl,
    token,
    user,
    handleRegister,
    handleLogin,
    updateUserProfile,
    searchUsers,
    handleLogout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
