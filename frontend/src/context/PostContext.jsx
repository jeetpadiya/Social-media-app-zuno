import axios from 'axios'
import cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { toast } from 'sonner';

export const PostContext = createContext();

const PostContextProvider =({children})=>{

const{backendUrl,token,handleLogout,user} = useContext(AuthContext)
const[Allposts,setAllposts] = useState([])
const[userPosts,setUserPosts] = useState([])

const utoken = cookies.get('token')

const fetchallPosts = async()=>{
        try{
                const {data} =  await axios.get(`${backendUrl}/api/posts/get-posts`)
                if(data.success){
                    setAllposts(data.posts)
                }
        }
        catch(error){
            toast.error(error.message)
        }
}

const fetchPostsofLoginUser =async()=>{
    try{
        

            const {data} = await axios.get(`${backendUrl}/api/posts/user-posts`,{

                headers:{
                  Authorization: `Bearer ${utoken}`

                }
            })
            console.log('token',token)

            if(!data){
                toast.error(data.message || "Failed to fetch user's posts")
                return;
            }
            if(data.success){
                setUserPosts(Array.isArray(data.posts) ? data.posts : [])
            }
    }
    catch(error){
        console.log(error);
        if (error.response?.status === 401) {
            toast.error('Session expired, please log in again.')
            handleLogout()
            return
        }
        toast.error(error.response?.data?.message || error.message)
    }
}

const likePosts =async(id)=>{
    try{
            const {data} = await  axios.put(`${backendUrl}/api/posts/posts/${id}/like`,{},{
                    headers:{
                        Authorization: `Bearer ${utoken}`
                    }
            })
            if(data.success){
                toast.success(data.message)
                fetchallPosts()
            }
    }
    catch(error){
        toast.error(error.message)
    }
}

const postsComments = async (id,text)=>{
    try{    
             const{data} = await axios.post(`${backendUrl}/api/posts/posts/${id}/comment`,{text},{
                headers:{
                    Authorization:`Bearer ${utoken}`
                }
             })
             if(data.success){
                toast.success(data.message)
                const normalizedComment = {
                    ...data.comment,
                    user: data.comment?.user?.username ? data.comment.user : {
                        _id: user?._id || user?.id,
                        username: user?.username || 'You',
                        avatar: user?.avatar || ''
                    }
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
             }
    }
   catch(error){
    toast.error(error.message);
   }
}

const createPost = async(text,image)=>{
        const formData =  new   FormData()
        formData.append('text',text)
        if(image){
            formData.append("image",image)
        }

        try{
                 const {data} =  await axios.post(`${backendUrl}/api/posts/create`,formData,{
                    headers:{
                        Authorization : `Bearer ${utoken}`
                    }
                 })   
                 if(data.success){
                    toast.success(data.message)
                    await Promise.all([fetchallPosts(), fetchPostsofLoginUser()])
                    return true
                 }
        }
        catch(error){
            toast.error(error.message)
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
        Authorization: `Bearer ${utoken}`
      }
    })

    if (data.success) {
      toast.success(data.message || 'Post updated successfully')
      await Promise.all([fetchPostsofLoginUser()])
      return true
    }
  }
  catch(error){
    toast.error(error.response?.data?.message || error.message)
    console.log(error)
  }

  return false
}

const deltePosts = async (id) => {
  try {
    const { data } = await axios.delete(`${backendUrl}/api/posts/posts/${id}`, {
      headers: {
       Authorization: `Bearer ${utoken}`,
      },
    });
       if (data.success) {
      toast.success(data.message);

      // Optimistically remove post from state
      setUserPosts((prev) => prev.filter((post) => post._id !== id));
      setAllposts((prev) => prev.filter((post) => post._id !== id));

      // Optionally re-fetch to sync with backend
      // fetchPostsofLoginUser();
      // fetchallPosts();
    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

useEffect (()=>{
    if(token){
        fetchallPosts()
        fetchPostsofLoginUser()
    }
},[token])

const values={
    fetchallPosts,
    fetchPostsofLoginUser,
    likePosts,
    postsComments,
    createPost,
    deltePosts,
    UpdatePosts,
    Allposts,
    userPosts,
    setUserPosts

}

    return(
        <PostContext.Provider value={values}>
            {children}
        </PostContext.Provider>
    )
}

export default PostContextProvider
