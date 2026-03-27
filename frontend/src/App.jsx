import { useContext } from 'react'
import { ToastContainer } from 'react-toastify'
import { AuthContext } from './context/AuthContext'
import NavBar from './components/NavBar'
import { Routes, Route, Navigate } from 'react-router-dom'
import PostPage from './pages/PostPage'
import AddPost from './components/AddPost'
import Landing from './pages/Landing'
import Register from './pages/Register'
import ProfilePage from './pages/ProfilePage'
import UserProfilePage from './pages/UserProfilePage'

function App() {
  const { token } = useContext(AuthContext)

  return (
    <div className="min-h-screen">
      <ToastContainer />

      {token ? (
        <>
          <NavBar />
          <Routes>
            <Route path="/posts" element={<PostPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route path="/" element={<Navigate to="/posts" replace />} />
            <Route path="/create-post" element={<AddPost />} />
            {/* catch-all: redirect unknown to /posts */}
            <Route path="*" element={<Navigate to="/posts" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          {/* redirect root and unknown to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  )
}

export default App
