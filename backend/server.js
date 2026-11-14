import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import notificationRouter from './routes/notificationRouter.js';

const app = express();
const PORT = process.env.PORT  || 5000

app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter)
app.use('/api/posts',postRouter)
app.use('/api/notifications',notificationRouter)

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT,()=>{
                console.log(`Server is connceted with this :${PORT}`)
        })
    } catch (error) {
        console.error('Failed to connect to database', error)
        process.exit(1)
    }
}

startServer()
