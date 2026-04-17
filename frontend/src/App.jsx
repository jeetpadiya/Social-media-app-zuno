import { useContext } from 'react'
import { Toaster } from 'sonner'
import { AuthContext } from './context/AuthContext'
import NavBar from './components/NavBar'
import { Routes, Route, Navigate } from 'react-router-dom'
import PostPage from './pages/PostPage'
import AddPost from './components/AddPost'
import Landing from './pages/Landing'
import Register from './pages/Register'
import ProfilePage from './pages/ProfilePage'
import UserProfilePage from './pages/UserProfilePage'
import FortgotPassword from './pages/FortgotPassword'
import RestPassword from './pages/RestPassword'

function App() {
  const { token } = useContext(AuthContext)

  return (
    <div className="app-frame">
      <div className="app-content min-h-screen">
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand
        toastOptions={{
          className: 'sonner-toast',
          style: {
            background: 'rgba(10, 19, 33, 0.92)',
            color: '#f7fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 24px 80px rgba(2, 6, 23, 0.45)',
            backdropFilter: 'blur(22px)',
          },
        }}
      />

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
          <Route path="/forgot-password" element={<FortgotPassword />} />
          <Route path="/reset-password/:token" element={<RestPassword />} />
        </Routes>
      )}
      </div>
    </div>
  )
}

export default App
