import express from 'express';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import {createPost,getPost,getPostByUser,updatePost,deletePost,toggleLike,addComment} from '../controllers/postController.js';


const postRouter = express.Router();

postRouter.post('/create',protect,upload.single('image'),createPost)
postRouter.get('/get-posts',getPost)
postRouter.get('/user-posts',protect,getPostByUser)
postRouter.put('/posts/:id',protect,upload.single('image'),updatePost)
postRouter.delete('/posts/:id',protect,deletePost)
postRouter.put('/posts/:id/like',protect,toggleLike)
postRouter.post('/posts/:id/comment',protect,addComment)  


export default postRouter