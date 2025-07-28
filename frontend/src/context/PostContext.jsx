import axios from 'axios'
import cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const PostContext = createContext();

const PostContextProvider =({children})=>{

const navigate = useNavigate();

const{backendUrl,token} = useContext(AuthContext)
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

            if(data.success){
                setUserPosts(data.posts)
            }
    }
    catch(error){
        console.log(error);  
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
                fetchallPosts();
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
                    fetchallPosts();
                    navigate('/posts')
                 }
        }
        catch(error){
            toast.error(error.message)
        }
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
},[])

const values={
    fetchallPosts,
    fetchPostsofLoginUser,
    likePosts,
    postsComments,
    createPost,
    deltePosts,
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
