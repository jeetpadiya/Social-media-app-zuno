import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import SideBar from "../components/SideBar";
import {FaCommentDots, FaThumbsUp} from "react-icons/fa"
import { IoIosAttach } from 'react-icons/io';
import { IoSend }from 'react-icons/io5';
import Profile from '../components/Profile'



const PostPage = () => {

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


  return (
    <div className="flex flex-col md:flex-row overflow-auto">
      <div className="hidden md:block p-3 ">
        <SideBar/>
      </div>
      <div className="flex-1 p-4">
        <div className="container text-white  h-[87vh] mx-auto max-w-screen-sm space-y-6 overflow-card">
          {Allposts.slice().reverse().map((post,index)=>(
            <div key={index} className="bg-gradient-to-r from=[#13072e] to[#3f2182] rounded-lg  shadow p-4  space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex  justify-center items-center text-lg font-bold text-gray-600">
                    <img src={post.user.avatar} alt="User DP" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{post.user.username}</h4>
                  </div>
                </div>
                <p className="text-white">{post.text}</p>
                <img src= {post.image} alt="Post Image" className="w-full rounded-lg object-cover"/>
                <div className="flex justify-start gap-4 text-white text-sm items-center">
                  <div onClick={()=>likePosts(post._id)} className="flex items-center  gap-1">
                    <FaThumbsUp className="text-xl  hover:text-blue-500 cursor-pointer"/>
                    <span>
                      {post.likes.length} Likes
                    </span>
                  </div>
                   <div className="flex items-center  gap-1">
                    <FaCommentDots className="text-xl cursor-pointer"/>
                    <span>
                      {post.comments.length} Comments
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                <p className="font-bold text-white ">Comments:</p>
                <div className="max-h-20 overflow-y-scroll space-y-1">
                {post.comments.slice(0,3).map((comment,index)=>(
                    <p key={index} className="text-white rounded p-2 flex flex-row justify-start items-center gap-2">
                        {comment.text}
                    </p>
                ))}
                </div>
                </div>
                <form onSubmit={(e)=>handleSubmit(e,post._id)} className="flex text-black items-center space-x mt-4">
                    <div className="w-8 h-8 hidden md:block rounded-full bg-gray-200 overflow-hidden">
                      <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover"/>
                    </div>
                    <input type="text"value={comments[post._id || ""]} onChange={e=>handleChange(e,post._id)} name="text" placeholder="Write Your Comment" className="flex-1 bg-white text-black border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 foucs:ring-blue-300"/>

                    <div className="flex space-x-2">
                      <button type="button" className="p-2 text-2xl rounded-full  text-white" title="Attach File">
                      <IoIosAttach/>
                      </button>
                      <button type="submit" className="p-2 text-2xl hover:bg-[#13072e] rounded -full text-white" title="Post Comment">
                      <IoSend className="cursor-pointer"/>
                      </button>
                      
                    </div>
                </form>
            </div>
          ))}
        </div>
      </div>
          <div className="w-1/3">
            <Profile/>
          </div>

    </div>
  )
}

export default PostPage
