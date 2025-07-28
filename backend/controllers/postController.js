import postModel from '../models/postSchema.js'

const createPost =  async(req,res)=>{
    const {text} = req.body

    try{
            const post = await postModel.create({
                user:req.user,
                text,
                image:req.file?.path    
            })

            res.status(200).json({success:true,message:"post uploaded successfully",post})
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

const getPost = async (req,res)=>{
    try{
            const posts = await postModel.find().populate('user','username avatar ,comments.user, username avatar').sort({createdAt:-1})
            res.status(200).json({success:true,posts})
    }
     catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

const getPostByUser = async (req, res) => {
  const userId = req.user;        // directly the ID string

  // protect() already ensured token validity, so no need for a 400 here
  try {
    const posts = await postModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    if (!posts.length) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found for this user" });
    }

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updatePost =  async(req,res)=>{
    const {text} = req.body
    const postId =  req.params.id

    try{
        const post =await postModel.findById(postId)
            if(!post){
                return res.status(404).json({success:false,message:"post not found"})
            }
            if(post.user.toString() !== req.user){
                    return res.status(403).json({success:false,message:"You are not authorized to Update this post"})
            }

            const updatedPost=  await postModel.findByIdAndUpdate(
                postId,
                {
                     text :text || post.text,
                     image:req.file?.path ||  post.image   
                },
                {new:true}
            )
            res.status(200).json({success:true,updatedPost})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

const deletePost = async(req,res)=>{
    try{
            const post= await postModel.findById(req.params?.id)
             if(!post){
                return res.status(404).json({success:false,message:"post not found"})
             }
              if(post.user.toString() !== req.user){
                    return res.status(403).json({success:false,message:"You are not authorized to Delete this post"})
            }
                await post.deleteOne()
                res.status(200).json({success:true,message:"Post Delteted Successfully"})


        }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
    
}

const toggleLike = async(req,res)=>{
    const postId = req.params.id
    const userId =req.user

    try{
        const post = await postModel.findById(postId)  
        if(!post){
                return res.status(404).json({success:false,message:"post not found"})
             }

            const alreadyLiked = post.likes.includes(userId)
            if(alreadyLiked){
                post.likes = post.likes.filter((id)=>id.toString()  !== userId.toString())
            }
            else{
                post.likes.push(userId)
            }

            await post.save()
            res.status(200).json({success:true,message:alreadyLiked ?  "Post Unliked" : "Post Liked",likes:post.likes.length})

    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

const addComment = async(req,res)=>{
    const {id:postId} =  req.params;
    const  {text} = req.body;
    const userId = req.user

    try{
        const post = await  postModel.findById(postId)

        if(!post){
            return res.status(404).json({success:false,message:"Post Not Found"})
        }

        post.comments.push({user:userId,text})
        await post.save()
        res.status(200).json({success:true,message:"Comments Add Successfully",comment:post.comments[post.comments.length-1]})
    }
    catch(error){
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}

export {createPost,getPost,getPostByUser,updatePost,deletePost,toggleLike,addComment}