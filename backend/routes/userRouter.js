import express from 'express'
import { register,login ,me, getUserById,UpdateUser,serachUser,forgotPassword,resetPassword } from '../controllers/userController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register',upload.single('image'),register);
userRouter.post('/login',login);
userRouter.get('/me',protect,me);
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password', (req, res, next) => {
    console.log("RESET ROUTE HIT");
    next();
}, resetPassword)
userRouter.put('/me',protect,upload.single('image'),UpdateUser)
userRouter.get('/search',protect,serachUser)
userRouter.get('/:id',protect,getUserById)



export default userRouter
