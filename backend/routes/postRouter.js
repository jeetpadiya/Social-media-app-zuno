import express from 'express';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import {
  createPost,
  getPost,
  getPostById,
  getFollowingPosts,
  getPostByUser,
  getPostByUserId,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  toggleBookmark,
  getBookmarkedPosts,
} from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.post('/create', protect, upload.single('image'), createPost)
postRouter.get('/get-posts', getPost)
postRouter.get('/post/:id', getPostById)
postRouter.get('/following-posts', protect, getFollowingPosts)
postRouter.get('/bookmarked-posts', protect, getBookmarkedPosts)
postRouter.get('/user-posts', protect, getPostByUser)
postRouter.get('/user/:id', protect, getPostByUserId)
postRouter.put('/posts/:id', protect, upload.single('image'), updatePost)
postRouter.delete('/posts/:id', protect, deletePost)
postRouter.put('/posts/:id/like', protect, toggleLike)
postRouter.put('/posts/:id/bookmark', protect, toggleBookmark)
postRouter.post('/posts/:id/comment', protect, addComment)

export default postRouter
