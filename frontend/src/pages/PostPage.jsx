import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import CommentComponent from "../components/CommentComponent";
import SideBar from "../components/SideBar";
import {FaCommentDots, FaThumbsUp} from "react-icons/fa"


const PostPage = () => {
  const POSTS_PER_PAGE = 5

  const navigate = useNavigate()
  const {user} = useContext(AuthContext)
  const {Allposts,likePosts,postsComments} =  useContext(PostContext)

const [comments, setComments] = useState({});
const [currentPage, setCurrentPage] = useState(1)

  const orderedPosts = Allposts.slice().reverse()
  const totalPages = Math.max(1, Math.ceil(orderedPosts.length / POSTS_PER_PAGE))
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = orderedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])


  const handleChange = (e,postId)=>{
      const text = e.target.value;
    setComments((prev)=>({...prev,[postId]:text}))
  }

  const handleSubmit = (e,postId)=>{
      e.preventDefault()
       const text = (comments[postId] || "").trim();
       if (!text) return;
        postsComments(postId, text);
        setComments(prev => ({ ...prev, [postId]: "" }));

      
  }

  const openUserProfile = (targetUser) => {
    const targetUserId = targetUser?._id || targetUser?.id
    const currentUserId = user?._id || user?.id

    if (!targetUserId) return
    if (targetUserId.toString() === currentUserId?.toString()) {
      navigate('/profile')
      return
    }

    navigate(`/users/${targetUserId}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  return (
    <div className="mx-auto flex max-w-7xl flex-col overflow-auto px-4 py-6 md:flex-row md:gap-6">
      <div className="hidden md:block md:shrink-0">
        <SideBar/>
      </div>
      <div className="flex-1 p-4">
        <div className="mx-auto mb-6 max-w-screen-sm rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,122,89,0.12),rgba(83,216,251,0.08))] p-6 shadow-[0_18px_80px_rgba(2,6,23,0.28)]">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-300">Community Feed</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Stories, snapshots, and honest updates.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            A calmer feed with stronger hierarchy helps the content feel intentional and premium.
          </p>
        </div>
        <div className="mx-auto max-w-screen-sm space-y-6 pr-2 text-white">
          {paginatedPosts.map((post,index)=>(
            <div key={index} className="glass-panel space-y-5 rounded-[30px] p-5">
                {(() => {
                  const currentUserId = user?._id || user?.id
                  const hasLiked = (post.likes || []).some((likedUserId) => {
                    const normalizedLikedId =
                      typeof likedUserId === 'string' ? likedUserId : likedUserId?._id || likedUserId?.id
                    return normalizedLikedId?.toString() === currentUserId?.toString()
                  })

                  return (
                    <>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold text-gray-600 ring-1 ring-white/10">
                    <img
                      src={post.user?.avatar ?? ""}
                      alt="User DP"
                      className="h-full w-full cursor-pointer rounded-2xl object-cover"
                      onClick={() => openUserProfile(post.user)}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openUserProfile(post.user)}
                      className="text-left text-lg font-semibold transition hover:text-sky-300"
                    >
                      {post.user?.username || "Unknown user"}
                    </button>
                    <p className="text-sm text-slate-400">Sharing something with the community</p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  Fresh post
                </span>
                </div>
                <p className="text-[15px] leading-7 text-slate-100">{post.text}</p>
                {post.image && (
                  <div className="overflow-hidden rounded-[26px] border border-white/10 bg-white/5">
                    <img src= {post.image} alt="Post Image" className="max-h-[28rem] w-full object-cover"/>
                  </div>
                )}
                <div className="flex flex-wrap justify-start gap-3 text-sm text-white">
                  <div onClick={()=>likePosts(post._id)} className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition ${hasLiked ? 'border-sky-300/25 bg-sky-400/15 text-sky-200' : 'border-white/10 bg-white/6 text-slate-200 hover:bg-white/10'}`}>
                    <FaThumbsUp className={`text-base transition ${hasLiked ? 'text-sky-300' : 'hover:text-sky-300'}`}/>
                    <span className={hasLiked ? 'font-semibold text-blue-200' : ''}>
                      {post.likes?.length || 0} Likes
                    </span>
                  </div>
                   <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-slate-200">
                    <FaCommentDots className="text-base"/>
                    <span>
                      {post.comments?.length || 0} Comments
                    </span>
                  </div>
                </div>
                <CommentComponent
                  comments={post.comments || []}
                  postId={post._id}
                  currentUser={user}
                  draftComment={comments[post._id] || ""}
                  onCommentChange={handleChange}
                  onCommentSubmit={handleSubmit}
                  onOpenUserProfile={openUserProfile}
                />
                    </>
                  )
                })()}
            </div>
          ))}
          {orderedPosts.length === 0 && (
            <div className="glass-panel rounded-[30px] p-8 text-center">
              <p className="text-lg font-semibold text-white">No posts yet</p>
              <p className="mt-2 text-sm text-slate-400">Once people start sharing, the feed will appear here.</p>
            </div>
          )}
          {orderedPosts.length > POSTS_PER_PAGE && (
            <div className="glass-panel flex flex-col items-center justify-between gap-4 rounded-[28px] px-5 py-4 text-sm text-slate-300 sm:flex-row">
              <p>
                Showing <span className="font-semibold text-white">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-white">
                  {Math.min(startIndex + POSTS_PER_PAGE, orderedPosts.length)}
                </span>{" "}
                of <span className="font-semibold text-white">{orderedPosts.length}</span> posts
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                      currentPage === page
                        ? 'border-sky-300/30 bg-sky-400/15 text-sky-100'
                        : 'border-white/10 bg-white/6 text-white hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostPage
