import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import { MdDelete } from 'react-icons/md';

const Profile = ({ profileUser, posts, isOwnProfile = true }) => {
  const { user,handleLogout } = useContext(AuthContext);
  const { userPosts, deltePosts } =
    useContext(PostContext);
  const displayUser = profileUser || user
  const safeUserPosts = Array.isArray(posts) ? posts : Array.isArray(userPosts) ? userPosts : [];

  if (!displayUser) {
    return <div className="p-6 text-white">Loading profile…</div>;
  }

  return (
    <div className="min-h-[87vh] rounded-2xl border border-gray-700 bg-gradient-to-b from-[#13072e] to-[#3f2182] p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={displayUser.avatar}
            alt="user avatar"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="hidden justify-center lg:block">
            <h1 className="text-2xl font-bold text-white">{displayUser.username}</h1>
            <p className="text-white text-sm">{displayUser.email}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="font-semibold text-white">Total Posts:</span>
              <span className="text-white">{safeUserPosts.length}</span>
              {isOwnProfile && (
                <button className='cursor-pointer rounded-lg border border-white/20 px-3 py-1 text-sm text-white transition hover:bg-white/10' onClick={handleLogout}>Logout</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-4xl">
        <h2 className="text-xl font-bold text-white mb-4">Uploaded Photos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {safeUserPosts.map((post) => (
            <div
              key={post._id}
              className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow group"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt="user post"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#1b123f] px-3 text-center text-sm text-white">
                  Text-only post
                </div>
              )}
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MdDelete
                    onClick={() => deltePosts(post._id)}
                    className="text-red-800 text-2xl cursor-pointer"
                  />
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
