import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import FortgotPassword from "./FortgotPassword";
import image from '../assets/Logo.jpg'
import image2 from '../assets/logo2.png'
// import microsoft from '../assets/microsoft.jpg'
// import play from '../assets/play.png'
import HoverCard from "@darenft/react-3d-hover-card"
import "@darenft/react-3d-hover-card/dist/style.css"

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
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-8 px-6 py-10 text-white lg:flex-row">
      <div className="flex w-full max-w-2xl flex-col justify-center lg:w-1/2">
        <p className="text-xs uppercase tracking-[0.34em] text-sky-200/80">Social storytelling</p>
        <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-white md:text-6xl">
          A social app should feel alive, not copied.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
          Zuno is now framed as a calmer, more cinematic place for photos, updates, and conversations that feel personal.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Immersive feed</span>
          <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Clean creator profiles</span>
          <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Focused sharing</span>
        </div>
        <div className="mt-10 hidden md:flex md:items-center md:justify-start">
        <HoverCard scaleFactor={1.4}>
          <h1 className="text-3xl font-black tracking-[0.2em] text-white">ZUNO</h1>
          <img src={image} alt="Logo" className="mt-6 hidden max-w-xl rounded-[32px] border border-white/10 shadow-[0_30px_90px_rgba(2,6,23,0.45)] transition-transform duration-500 ease-in-out hover:translate-x-2 hover:translate-y-2 lg:block" />
        </HoverCard>
      </div>
      </div>

      <div className="glass-panel mx-4 w-full max-w-md flex-1 rounded-[32px] p-6">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-lg backdrop-blur-sm">
          <img src={image2} alt="logo" className="mb-6 w-full"/>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Welcome back</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Log in to your space</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text"
              value={userFormData.email}
              name="email"
              onChange={handleChange}
              placeholder="Phone number,username or  email"
              className="w-full rounded-2xl border border-white/10 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <input type="password"
              value={userFormData.password}
              onChange={handleChange}
              name="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-white/10 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <button type="submit" className="accent-button w-full rounded-2xl py-3 font-bold transition">
              Log In
            </button>
          </form>
          <div className="my-5 flex items-center">
            <hr className="flex-1 border-white/10" />
            <span className="px-3 text-xs uppercase tracking-[0.22em] text-slate-500">OR</span>
            <hr className="flex-1 border-white/10" />
          </div>
        <p className="mt-4 text-center text-sm text-gray-400">
            New User?{" "}
            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer font-semibold text-[#ff9c7c] hover:underline"
              >
              Sign Up {" "}  
            </span>
              or{" "}              
            Now

            forgot password?{" "}
            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer font-semibold text-[#ff9c7c] hover:underline"
              >
              Reset Password
            </span>
          </p>
              </div>
      </div>
    </div>
  )
}

export default Landing
