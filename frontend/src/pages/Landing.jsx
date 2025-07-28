import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import image from '../assets/Logo.jpg'
import image2 from '../assets/logo2.png'
import microsoft from '../assets/microsoft.jpg'
import play from '../assets/play.png'
import HoverCard from "@darenft/react-3d-hover-card"
import "@darenft/react-3d-hover-card/dist/style.css"
import { FaFacebook } from "react-icons/fa"
import { FaGoogle } from "react-icons/fa"
import { FaApple } from "react-icons/fa"

const Landing = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const [userFormData, setUserFormData] = useState({
    email: "",
    password: ""

  });

  const handleChange = async (e)=>{
      const {name,value} =e.target
      setUserFormData((prev)=>({...prev,[name]:value}))
  }

  const handleSubmit = async(e)=>{
      e.preventDefault()
      await handleLogin(userFormData.email,userFormData.password)
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen text-white p-6">
      <div className="md:flex md:w-1/2 items-center justify-center">
        <HoverCard scaleFactor={1.4}>
          <h1>Zuno</h1>
          <img src={image} alt="Logo" className="max-w-2xl mt-6 rotate-3 border rounded-lg border-gray-700 transition-transfrom duration-500 ease-in-out transform hover:translate-x-2 shadow-xl shadow-black hover:translate-y-2 hidden lg:block" />
        </HoverCard>
      </div>

      <div className="flex-1 max-w-md mx-4 sm:mx-4-auto border border-gray-500 rounded-xl">
        <div className="rounded-lg p-6 shadow-lg">
          <img src={image2} alt="logo" className="w-full h-27 mb-6"/>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text"
              value={userFormData.email}
              name="email"
              onChange={handleChange}
              placeholder="Phone number,username or  email"
              className="w-full p-3  rounded-lg bg-white text-gray-900  foucs:outline-none focus:ring focus:ring-blue-500"
            />
            <input type="password"
              value={userFormData.password}
              onChange={handleChange}
              name="password"
              placeholder="Password"
              className="w-full p-3  rounded-lg bg-white text-gray-900  foucs:outline-none focus:ring focus:ring-blue-500"
            />
            <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold">
              Log In
            </button>
          </form>
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-700" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="flex-1 border-gray-700" />
          </div>
          <div className="py-3 rounded-lg flex flex-row items-center justify-evenly space-x-2">
          <FaFacebook className="tex-3xl cursor-pointer"/>
          <FaGoogle className="tex-3xl cursor-pointer"/>
          <FaApple className="tex-3xl cursor-pointer"/>
          </div>
          <a href="/" className="block text-center text-sm text-gray-400  mt-4  hover:underlin">
            Forgot password?
          </a>
        </div>
        <div className="mt-4 bg-[#251469e8] text-gray-400 rounded-lg p-4 text-center">
          Don&apos;t have an account?{" "}
          <span onClick={()=>navigate("/register")} className="text-blue-600 hover-:underline cursor-pointer">
            Sign Up
          </span>
          <div className="mt-6 text-center">
              <p>Get The app</p>
              <div className="flex justify-center space-x-4 mt-4">
                <img src={play} alt="google play image " className="w-28 md:w-32  h-10 cursor-pointer" />
                <img src={microsoft} alt="microsoftlog" className="w-28 md:w-32  h-10 cursor-pointer"/>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
