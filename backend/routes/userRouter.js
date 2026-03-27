import express from 'express'
import { register,login ,me, getUserById } from '../controllers/userController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register',upload.single('image'),register);
userRouter.post('/login',login);
userRouter.get('/me',protect,me)
userRouter.get('/:id',protect,getUserById)



export default userRouter
