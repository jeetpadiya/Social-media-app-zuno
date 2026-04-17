import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from "react-icons/fa";
import EditPopup from '../popups/EditPopup';
import EditProfilePopup from '../popups/EditProfilePopup';

const Profile = ({ profileUser, posts, isOwnProfile = true }) => {
  const { user, handleLogout, updateUserProfile } = useContext(AuthContext);
  const { userPosts, deltePosts,UpdatePosts } =
    useContext(PostContext);
  const displayUser = profileUser || user
  const safeUserPosts = Array.isArray(posts) ? posts : Array.isArray(userPosts) ? userPosts : [];
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
    return <div className="p-6 text-white">Loading profile…</div>;
  }

  return (
    <div className="glass-panel min-h-[calc(100vh-9rem)] rounded-[32px] p-6">
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
      <div className="mx-auto max-w-4xl rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,122,89,0.12),rgba(83,216,251,0.08))] p-6 shadow-lg">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-6">
          <img
            src={displayUser.avatar}
            alt="user avatar"
            className="h-32 w-32 rounded-[30px] object-cover ring-1 ring-white/10"
          />
          <div className="w-full text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-300">
              {isOwnProfile ? 'Your profile' : 'Creator profile'}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{displayUser.username}</h1>
            <p className="mt-1 text-sm text-slate-200">{displayUser.email}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white">
                {safeUserPosts.length} posts shared
              </span>
              <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white">
                Visual journal
              </span>
              {isOwnProfile && (
                <>
                  <button
                    className='rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12'
                    onClick={() => setIsProfileEditOpen(true)}
                  >
                    Edit Profile
                  </button>
                  <button className='rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12' onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-4xl">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Gallery</p>
            <h2 className="mt-2 text-2xl font-black text-white">Uploaded moments</h2>
          </div>
          <p className="text-sm text-slate-400">A cleaner profile grid with stronger image framing.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {safeUserPosts.map((post) => (
            <div
              key={post._id}
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1727] shadow-[0_18px_48px_rgba(2,6,23,0.28)] aspect-square"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt="user post"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#122137] px-3 text-center text-sm text-white">
                  Text-only post
                </div>
              )}
              {isOwnProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <MdDelete
                    onClick={() => deltePosts(post._id)}
                    className="cursor-pointer text-3xl text-[#ff7a59]"
                  />
                  <FaEdit className="cursor-pointer text-2xl text-[#ff7a59]" onClick={() => handleEditPost(post)}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
