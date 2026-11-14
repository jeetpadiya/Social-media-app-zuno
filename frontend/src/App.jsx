import { useContext } from 'react'
import { Toaster } from 'sonner'
import { AuthContext } from './context/AuthContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import PostPage from './pages/PostPage'
import PostDetailPage from './pages/PostDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import AddPost from './components/AddPost'
import Landing from './pages/Landing'
import Register from './pages/Register'
import ProfilePage from './pages/ProfilePage'
import UserProfilePage from './pages/UserProfilePage'
import BookmarksPage from './pages/BookmarksPage'
import FortgotPassword from './pages/FortgotPassword'
import RestPassword from './pages/RestPassword'

function App() {
  const { token } = useContext(AuthContext)

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-150">
      <Toaster
        position="top-right"
        closeButton
        expand
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            boxShadow: 'none',
            borderRadius: '12px',
          },
        }}
      />

      {token ? (
        <Routes>
          <Route path="/posts" element={<PostPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/create-post" element={<AddPost />} />
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/forgot-password" element={<FortgotPassword />} />
          <Route path="/reset-password/:token" element={<RestPassword />} />
        </Routes>
      )}
    </div>
  )
}

export default App
