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
    <div className="flex flex-col items-center justify-between bg-[#0c0620] px-3 py-2 text-white md:flex-row">
      <div className="w-full md:w-auto flex justify-between items-center">
        <img src={logo} alt="" className="w-24 cursor-pointer md:w-32" onClick={()=>navigate('/posts')}/>
        <button className="text-2xl md:hidden" onClick={()=>setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoMdClose/> :<IoMdMenu/>}
        </button>
      </div>  
      <div className="hidden items-center md:flex md:space-x-4">
        <button
          onClick={handleProfile}
          className={`flex items-center space-x-2 rounded-lg border px-3 py-1.5 text-sm font-bold text-white transition ${
            isProfileActive
              ? 'border-blue-300/40 bg-blue-500/20 text-blue-100'
              : 'border-white/15 bg-white/8 hover:bg-white/15'
          }`}
        >
          <span className="text-sm">My Profile</span>
          <CgProfile className="text-xl"/>
        </button>
      </div>
      {menuOpen && (
        <div className="mt-3 flex w-full flex-col space-y-2 md:hidden">
          <button
            className={`flex w-full items-center justify-center gap-1 space-x-2 rounded-lg px-4 py-2 text-sm font-bold text-white ${
              isProfileActive ? 'bg-blue-500/20 text-blue-100' : 'hover:bg-gray-600'
            }`}
            onClick={handleProfile}
          >
            <CgProfile className="text-xl"/>My Profile
          </button>
           <button onClick={handleLogout} className="flex w-full items-center justify-center gap-1 space-x-2 rounded-lg px-4 py-2 text-sm font-bold text-white hover:bg-gray-600">
            <IoIosLogOut className="text-xl"/>Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default NavBar
