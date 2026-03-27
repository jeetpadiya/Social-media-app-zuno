import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import image from '../assets/Logo.jpg'
import image2 from '../assets/logo2.png'
// import microsoft from '../assets/microsoft.jpg'
// import play from '../assets/play.png'
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

      <div className="mx-4 w-full max-w-md flex-1 rounded-2xl border border-gray-500">
        <div className="rounded-2xl bg-white/5 p-6 shadow-lg backdrop-blur-sm">
          <img src={image2} alt="logo" className="mb-6 w-full"/>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text"
              value={userFormData.email}
              name="email"
              onChange={handleChange}
              placeholder="Phone number,username or  email"
              className="w-full rounded-lg bg-white p-3 text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input type="password"
              value={userFormData.password}
              onChange={handleChange}
              name="password"
              placeholder="Password"
              className="w-full rounded-lg bg-white p-3 text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
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
        <p className="text-center text-sm text-gray-400 mt-4">
            New User?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline cursor-pointer"
              >
              Sign Up {" "}  
            </span>
             
            Now
          </p>
              </div>
      </div>
    </div>
  )
}

export default Landing
