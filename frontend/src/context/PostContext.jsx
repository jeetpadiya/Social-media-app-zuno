import axios from 'axios'
import cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { toast } from 'sonner'

export const PostContext = createContext()

const PostContextProvider = ({ children }) => {
  const { backendUrl, token, handleLogout, user } = useContext(AuthContext)
  const [Allposts, setAllposts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  const utoken = cookies.get('token')

  const fetchallPosts = async () => {
    try {
      setLoadingPosts(true)
      const { data } = await axios.get(`${backendUrl}/api/posts/get-posts`)
      if (data.success) {
        setAllposts(Array.isArray(data.posts) ? data.posts : [])
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoadingPosts(false)
    }
  }

  const fetchPostsofLoginUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/posts/user-posts`, {
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
      })

      if (!data) {
        toast.error(data?.message || "Failed to fetch user's posts")
        return
      }
      if (data.success) {
        setUserPosts(Array.isArray(data.posts) ? data.posts : [])
      }
    } catch (error) {
      console.error(error)
      if (error.response?.status === 401) {
        toast.error('Session expired, please log in again.')
        handleLogout()
        return
      }
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // OPTIMISTIC LIKE TOGGLE
  const likePosts = async (id) => {
    const currentUserId = (user?._id || user?.id)?.toString()
    if (!currentUserId) return

    let previousAllPosts
    let previousUserPosts

    setAllposts((prev) => {
      previousAllPosts = prev
      return prev.map((post) => {
        if (post._id !== id) return post
        const likes = Array.isArray(post.likes) ? [...post.likes] : []
        const hasLiked = likes.some((likedUser) => {
          const likedId = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
          return likedId?.toString() === currentUserId
        })

        const updatedLikes = hasLiked
          ? likes.filter((likedUser) => {
              const likedId = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
              return likedId?.toString() !== currentUserId
            })
          : [...likes, currentUserId]

        return { ...post, likes: updatedLikes }
      })
    })

    setUserPosts((prev) => {
      previousUserPosts = prev
      return prev.map((post) => {
        if (post._id !== id) return post
        const likes = Array.isArray(post.likes) ? [...post.likes] : []
        const hasLiked = likes.some((likedUser) => {
          const likedId = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
          return likedId?.toString() === currentUserId
        })

        const updatedLikes = hasLiked
          ? likes.filter((likedUser) => {
              const likedId = typeof likedUser === 'string' ? likedUser : likedUser?._id || likedUser?.id
              return likedId?.toString() !== currentUserId
            })
          : [...likes, currentUserId]

        return { ...post, likes: updatedLikes }
      })
    })

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/posts/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${utoken}`,
          },
        }
      )
      if (!data.success) {
        // Rollback
        if (previousAllPosts) setAllposts(previousAllPosts)
        if (previousUserPosts) setUserPosts(previousUserPosts)
        toast.error(data.message || 'Failed to update like')
      }
    } catch (error) {
      // Rollback
      if (previousAllPosts) setAllposts(previousAllPosts)
      if (previousUserPosts) setUserPosts(previousUserPosts)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const postsComments = async (id, text) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/posts/posts/${id}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${utoken}`,
          },
        }
      )
      if (data.success) {
        toast.success(data.message || 'Comment added')
        const normalizedComment = {
          ...data.comment,
          user: data.comment?.user?.username
            ? data.comment.user
            : {
                _id: user?._id || user?.id,
                username: user?.username || 'You',
                avatar: user?.avatar || '',
              },
        }

        setAllposts((prev) =>
          prev.map((post) =>
            post._id === id
              ? {
                  ...post,
                  comments: [...(post.comments || []), normalizedComment],
                }
              : post
          )
        )

        setUserPosts((prev) =>
          prev.map((post) =>
            post._id === id
              ? {
                  ...post,
                  comments: [...(post.comments || []), normalizedComment],
                }
              : post
          )
        )
        return true
      }
    } catch (error) {
      toast.error(error.message)
    }
    return false
  }

  const createPost = async (text, image) => {
    const formData = new FormData()
    if (text) {
      formData.append('text', text)
    }
    if (image) {
      formData.append('image', image)
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/posts/create`, formData, {
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
      })
      if (data.success) {
        toast.success(data.message || 'Post created successfully')
        await Promise.all([fetchallPosts(), fetchPostsofLoginUser()])
        return true
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    return false
  }

  const UpdatePosts = async (id, updates = {}) => {
    const { text, image } = updates
    const formData = new FormData()

    if (typeof text === 'string') {
      formData.append('text', text)
    }

    if (image) {
      formData.append('image', image)
    }

    try {
      const { data } = await axios.put(`${backendUrl}/api/posts/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
      })

      if (data.success) {
        toast.success(data.message || 'Post updated successfully')
        await Promise.all([fetchallPosts(), fetchPostsofLoginUser()])
        return true
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      console.error(error)
    }

    return false
  }

  const deltePosts = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/posts/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
      })
      if (data.success) {
        toast.success(data.message || 'Post deleted')
        setUserPosts((prev) => prev.filter((post) => post._id !== id))
        setAllposts((prev) => prev.filter((post) => post._id !== id))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (token) {
      fetchallPosts()
      fetchPostsofLoginUser()
    }
  }, [token])

  const values = {
    fetchallPosts,
    fetchPostsofLoginUser,
    likePosts,
    postsComments,
    createPost,
    deltePosts,
    UpdatePosts,
    Allposts,
    userPosts,
    setUserPosts,
    loadingPosts,
  }

  return <PostContext.Provider value={values}>{children}</PostContext.Provider>
}

export default PostContextProvider
