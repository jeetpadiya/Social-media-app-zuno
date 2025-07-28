import  userModel  from '../models/userSchema.js'
import jwt  from 'jsonwebtoken'
import bcrypt, { genSalt, genSaltSync } from 'bcryptjs'



const register = async (req,res)=>{
    try{
        const  {username,email,password} = req.body

        if(!username || !email || !password){
            return  res.status(400).json({success:false,message:"All Fields Requrie"})
        }

        const avatarDP = req.file?.path
            if(!avatarDP){
                return res.status(400).json({success:false,message:"Avatar is Required"})
            }
            
        const existingUser =  await userModel.findOne({email})
        
        if(existingUser){
            return res.status(401).json({success:true,message:"User Already exist"})
        }

        const  salt = await bcrypt.genSalt(10)
        const hashedPassword =  await bcrypt.hash(password,salt)

        const newUser = new userModel({
            username,
            email,
            password:hashedPassword,
            avatar:avatarDP
        })
        await  newUser.save()

        const token = jwt.sign({id:newUser._id,email:newUser.email, name:newUser.usrname},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('token',token,{
            httpOnly:false,
            secure:false,
            sameSite:'Lax',
            maxAge:7 * 24 * 60 * 60 * 1000
        })

        const userResponse = {
                id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                avatar: newUser.avatar
        }

        res.status(201).json({success:true,message:"User Register successfully",user:userResponse,token:token})
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:true,message:"Internal Server Error"})
    }
}
const login = async(req,res)=>{
    try{
            const {email,password} =  req.body

        
        if(!email || !password){
            return  res.status(400).json({success:false,message:"All Fields Requrie"})
        }
            const user =await userModel.findOne({email})
            if(!user){
                return res.status(404).json({success:false,message:"user is not found"})
            }
                const isPasswordValid = await bcrypt.compare(password,user.password)
                if(!isPasswordValid){
                    res.status(401).json({success:false,message:"Invalid credtions"})
                }

                const token = jwt.sign({id:user._id,email:user.email,name:user.username},process.env.JWT_SECRET,{expiresIn:'7d'})
                 
            res.cookie('token',token,{
            httpOnly:false,
            secure:false,
            sameSite:'Lax',
            maxAge: 7*24*60*1000
        })
          const userResponse = {
                id:user._id,
                username:user.username,
                email:user.email,
                avatar: user.avatar
        }

        res.status(200).json({success:"true",message:"Login is succesfull",user:userResponse,token:token})

        }   
    catch(error){
        console.log(error);
        res.status(500).send({success:true,messsage:"Internal server error"})
    }
}

const me = async(req,res)=>{
     try{

        const user = await userModel.findById(req.user).select('-password')
        if(!user){
            return res.status(404).json({success:false,message:"User not Found"})
        }
        res.status(200).json({success:true,currentUser:user})


     }catch(error){
        console.log(error);
        res.status(500).send({success:true,messsage:"Internal server error"})
     }
}


export {register,login,me}