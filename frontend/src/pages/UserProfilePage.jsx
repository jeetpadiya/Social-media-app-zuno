import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import MainLayout from '../components/MainLayout'
import Profile from '../components/Profile'
import { ProfileSkeleton } from '../components/Skeleton'
import { AuthContext } from '../context/AuthContext'

const UserProfilePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, user } = useContext(AuthContext)
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const [userResponse, postsResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/user/${id}`),
          axios.get(`${backendUrl}/api/posts/user/${id}`),
        ])

        if (userResponse.data?.success) {
          setProfileUser(userResponse.data.user)
        }

        if (postsResponse.data?.success) {
          setPosts(
            Array.isArray(postsResponse.data.posts) ? postsResponse.data.posts : []
          )
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profile')
        navigate('/posts')
      } finally {
        setLoading(false)
      }
    }

    if (!id) return

    if ((user?._id || user?.id)?.toString() === id.toString()) {
      navigate('/profile', { replace: true })
      return
    }

    fetchProfileData()
  }, [backendUrl, id, navigate, user])

  return (
    <MainLayout title={profileUser?.username || 'Profile'}>
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <Profile profileUser={profileUser} posts={posts} isOwnProfile={false} />
      )}
    </MainLayout>
  )
}

export default UserProfilePage
