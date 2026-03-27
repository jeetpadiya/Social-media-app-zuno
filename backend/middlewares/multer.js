import multer from 'multer'
import {CloudinaryStorage} from  'multer-storage-cloudinary'
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'social_media_app',
        allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'svg'], // Added the 's'
        resource_type: 'auto', // Important for supporting both images and videos
    },
});

const upload = multer({storage})

export default upload