import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import SideBar from "../components/SideBar";
import {FaCommentDots, FaThumbsUp} from "react-icons/fa"
import { IoIosAttach } from 'react-icons/io';
import { IoSend }from 'react-icons/io5';


const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now'

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000))

  if (diffInSeconds < 60) return 'Just now'

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ]

  for (const interval of intervals) {
    const value = Math.floor(diffInSeconds / interval.seconds)
    if (value >= 1) return `${value}${interval.label} ago`
  }

  return 'Just now'
}


const PostPage = () => {

  const navigate = useNavigate()
  const {user} = useContext(AuthContext)
  const {Allposts,likePosts,postsComments} =  useContext(PostContext)

const [comments, setComments] = useState({});


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


  return (
    <div className="flex flex-col md:flex-row overflow-auto">
      <div className="hidden md:block p-3 ">
        <SideBar/>
      </div>
      <div className="flex-1 p-4">
        <div className="mx-auto h-[87vh] max-w-screen-sm space-y-6 overflow-y-auto pr-1 text-white">
          {Allposts.slice().reverse().map((post,index)=>(
            <div key={index} className="space-y-4 rounded-2xl bg-gradient-to-r from-[#13072e] to-[#3f2182] p-4 shadow-lg shadow-black/20">
                {(() => {
                  const currentUserId = user?._id || user?.id
                  const hasLiked = (post.likes || []).some((likedUserId) => {
                    const normalizedLikedId =
                      typeof likedUserId === 'string' ? likedUserId : likedUserId?._id || likedUserId?.id
                    return normalizedLikedId?.toString() === currentUserId?.toString()
                  })

                  return (
                    <>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex  justify-center items-center text-lg font-bold text-gray-600">
                    <img
                      src={post.user?.avatar ?? ""}
                      alt="User DP"
                      className="w-full h-full cursor-pointer object-cover rounded-full"
                      onClick={() => openUserProfile(post.user)}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openUserProfile(post.user)}
                      className="text-left text-lg font-bold transition hover:text-blue-300"
                    >
                      {post.user?.username || "Unknown user"}
                    </button>
                  </div>
                </div>
                <p className="text-white">{post.text}</p>
                {post.image && (
                  <img src= {post.image} alt="Post Image" className="w-full rounded-lg object-cover"/>
                )}
                <div className="flex justify-start gap-4 text-white text-sm items-center">
                  <div onClick={()=>likePosts(post._id)} className={`flex items-center gap-1 rounded-full px-2 py-1 transition ${hasLiked ? 'bg-blue-500/20 text-blue-300' : ''}`}>
                    <FaThumbsUp className={`cursor-pointer text-xl transition ${hasLiked ? 'text-blue-400' : 'hover:text-blue-500'}`}/>
                    <span className={hasLiked ? 'font-semibold text-blue-200' : ''}>
                      {post.likes?.length || 0} Likes
                    </span>
                  </div>
                   <div className="flex items-center  gap-1">
                    <FaCommentDots className="text-xl cursor-pointer"/>
                    <span>
                      {post.comments?.length || 0} Comments
                    </span>
                  </div>
                </div>
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">Comments</p>
                  <span className="text-xs uppercase tracking-wide text-gray-300">
                    {(post.comments || []).length} total
                  </span>
                </div>
                <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                {(post.comments || []).slice(0,3).map((comment,index)=>(
                    <div key={index} className="rounded-2xl bg-black/15 p-3">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-full bg-white/10">
                          <img
                            src={comment.user?.avatar ?? ""}
                            alt={comment.user?.username || "Comment user"}
                            className="h-full w-full cursor-pointer object-cover"
                            onClick={() => openUserProfile(comment.user)}
                          />
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => openUserProfile(comment.user)}
                            className="truncate text-left text-sm font-semibold text-white transition hover:text-blue-300"
                          >
                            {comment.user?.username || "Unknown user"}
                          </button>
                          <p className="text-xs text-gray-300">
                            {formatTimeAgo(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="pl-12 text-sm leading-6 text-gray-100">
                        {comment.text}
                      </p>
                    </div>
                ))}
                {(post.comments || []).length === 0 && (
                  <p className="rounded-xl bg-black/10 px-3 py-3 text-sm text-gray-300">
                    No comments yet. Be the first to say something.
                  </p>
                )}
                </div>
                </div>
                <form onSubmit={(e)=>handleSubmit(e,post._id)} className="mt-4 flex items-center gap-2 text-black">
                    <div className="w-8 h-8 hidden md:block rounded-full bg-gray-200 overflow-hidden">
                      <img src={user?.avatar ?? ""} alt="User Avatar" className="w-full h-full object-cover"/>
                    </div>
                    <input type="text"value={comments[post._id || ""]} onChange={e=>handleChange(e,post._id)} name="text" placeholder="Write Your Comment" className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-300"/>

                    <div className="flex space-x-2">
                      <button type="button" className="p-2 text-2xl rounded-full  text-white" title="Attach File">
                      <IoIosAttach/>
                      </button>
                      <button type="submit" className="rounded-full p-2 text-2xl text-white transition hover:bg-[#13072e]" title="Post Comment">
                      <IoSend className="cursor-pointer"/>
                      </button>
                      
                    </div>
                </form>
                    </>
                  )
                })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostPage
