import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import logo from '../assets/logo.jpg'
import {IoIosLogOut,IoMdMenu,IoMdClose} from 'react-icons/io'
import { IoAtCircleOutline } from "react-icons/io5"

const NavBar = () => {

  const {handleLogout} = useContext(AuthContext)
  const navigate = useNavigate()
  const [menuOpen,setMenuOpen] = useState(false)

  const handlePost = () =>{
    navigate("/create-post")
  }
  const handleLogoutClick =()=>{
    handleLogout()
    navigate('/')
  }

  return (
    <div className="flex flex-col md:flex-row  items-center  justify-between p-3  bg-[#0c0620] text-white">
      <div className="w-full md:w-auto flex justify-between items-center">
        <img src={logo} alt="" className="w-32 md:w-44 cursor-pointer" onClick={()=>navigate('/posts')}/>
        <button className="text-2xl md:hidden" onClick={()=>setMenuOpen(!menuOpen)}>
          {menuOpen ? <IoMdClose/> :<IoMdMenu/>}
        </button>
      </div>  
      <div className="hidden md:flex md:itesm-center  md:space-x-4 ">
        <button onClick={handlePost} className="flex items-center space-x-2 py-2 px-4  rounded-lg bg-blue-500  hover:bg-blue-600 font-bold text-white">
          <span className="text-sm">Add New Post</span>
          <IoAtCircleOutline className="text-xl"/>
        </button>
      </div>
      {menuOpen && (
        <div className="mt-4 md:hidden flex flex-col space-y-4 w-1/2">
          <button className="flex items-center  hover:bg-gray-600 gap-1 space-x-2 py-2 px-4 rounded-lg font-bold  text-white w-full  justify-center">
            <IoAtCircleOutline className="text-xl"/>Add New Post
          </button>
           <button onClick={handleLogoutClick} className="flex items-center  hover:bg-gray-600 gap-1 space-x-2 py-2 px-4 rounded-lg font-bold  text-white w-full  justify-center">
            <IoIosLogOut className="text-xl"/>Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default NavBar
