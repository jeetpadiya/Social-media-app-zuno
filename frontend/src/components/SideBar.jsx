
import { useContext } from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import {RiHome2Line} from 'react-icons/ri'
import {CgProfile} from 'react-icons/cg'
import { IoAtCircleOutline } from "react-icons/io5"


const SideBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {user,handleLogout} = useContext(AuthContext) 
  
      if (!user) return null;

  const isActive = (path) => location.pathname === path
  const navItemClass = (path) =>
    `flex w-full flex-row items-center gap-3 rounded-lg px-2 py-2 text-lg transition ${
      isActive(path)
        ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-300/30'
        : 'hover:bg-white/10'
    }`

  const createPostClass = `flex w-full flex-row items-center gap-3 rounded-lg px-2 py-2 text-md transition ${
    isActive('/create-post')
      ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-300/30'
      : 'hover:bg-white/10'
  }`


  return (
    <div className='flex h-[90vh] w-44 flex-col rounded border-r border-gray-600 bg-gradient-to-l from-[#13072e] to-[#3f2182] p-4 text-white'>
      <div className='mt-3 flex flex-col gap-3'>
     <button onClick={() => navigate('/posts')} className={navItemClass('/posts')}>
       <RiHome2Line/>
      <p className='text-white'>Home</p>
     </button>
     <button onClick={() => navigate('/profile')} className={navItemClass('/profile')}>
       <CgProfile/>
      <p className='text-white'>Profile</p>
     </button>
      </div>
      <div className='mt-6 flex flex-col gap-3'>
        <button onClick={() => navigate('/create-post')} className={createPostClass}>
        <IoAtCircleOutline/>
        <p className='text-white'>Create Post</p>
        </button>
      </div>
      <div onClick={handleLogout} className='mt-auto flex cursor-pointer flex-row items-center gap-3 rounded-lg bg-red-700 px-2 py-2 text-white'>
        <img src={user.avatar} alt="avatar" className='rounded-full w-10 h-8 '/>
        <p className='text-md'> LogOut</p>
      </div>
    </div>
  )
}

export default SideBar
