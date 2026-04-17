import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom"
import logo from '../assets/Logo.jpg'
import {IoIosLogOut,IoMdMenu,IoMdClose} from 'react-icons/io'
import { CgProfile } from 'react-icons/cg'

const NavBar = () => {

  const {handleLogout} = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen,setMenuOpen] = useState(false)

  const handleProfile = () =>{
    navigate("/profile")
  }

  const isProfileActive = location.pathname === '/profile'

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,12,23,0.72)] px-4 py-3 text-white backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 md:flex-row">
      <div className="flex w-full items-center justify-between md:w-auto md:gap-4">
        <button
          type="button"
          className="flex items-center gap-3"
          onClick={() => navigate('/posts')}
        >
          <img src={logo} alt="Zuno logo" className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/15" />
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.32em] text-sky-200/80">Social space</p>
            <p className="text-xl font-black tracking-[0.14em] text-white">ZUNO</p>
          </div>
        </button>
        <button className="text-2xl md:hidden" onClick={()=>setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoMdClose/> :<IoMdMenu/>}
        </button>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-300">
          Capture moments. Share with intent.
        </div>
        <button
          onClick={handleProfile}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-white transition ${
            isProfileActive
              ? 'border-sky-300/40 bg-sky-400/15 text-sky-100'
              : 'border-white/15 bg-white/6 hover:bg-white/12'
          }`}
        >
          <span>My Profile</span>
          <CgProfile className="text-xl"/>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12"
        >
          <IoIosLogOut className="text-xl"/>
          <span>Logout</span>
        </button>
      </div>
      {menuOpen && (
        <div className="glass-panel mt-1 flex w-full flex-col space-y-2 rounded-3xl p-3 md:hidden">
          <button
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white ${
              isProfileActive ? 'bg-sky-400/15 text-sky-100' : 'bg-white/5 hover:bg-white/10'
            }`}
            onClick={handleProfile}
          >
            <CgProfile className="text-xl"/>My Profile
          </button>
           <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
            <IoIosLogOut className="text-xl"/>Logout
          </button>
        </div>
      )}
      </div>
    </div>
  )
}

export default NavBar
