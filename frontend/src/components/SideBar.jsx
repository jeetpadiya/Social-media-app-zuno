import { useContext, useEffect, useRef, useState } from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import {RiHome2Line} from 'react-icons/ri'
import {CgProfile} from 'react-icons/cg'
import { IoAtCircleOutline } from "react-icons/io5"
import { FaSearch } from "react-icons/fa";



const SideBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchContainerRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  const {user,handleLogout,searchUsers} = useContext(AuthContext) 
  

  const isActive = (path) => location.pathname === path
  const navItemClass = (path) =>
    `flex w-full flex-row items-center gap-3 rounded-2xl px-3 py-3 text-base font-medium transition ${
      isActive(path)
        ? 'bg-sky-400/15 text-sky-100 ring-1 ring-sky-200/25'
        : 'text-slate-200 hover:bg-white/10'
    }`

  const createPostClass = `accent-button flex w-full flex-row items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
    isActive('/create-post')
      ? 'ring-2 ring-orange-200/50'
      : ''
  }`

  useEffect(() => {
    const trimmedQuery = searchQuery.trim()

    if (!trimmedQuery) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    let isCancelled = false

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      const users = await searchUsers(trimmedQuery)

      if (!isCancelled) {
        setSearchResults(Array.isArray(users) ? users : [])
        setShowSearchDropdown(true)
        setIsSearching(false)
      }
    }, 250)

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [searchQuery, searchUsers])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

        if (!user) return null;

  const handleOpenProfile = (profileId) => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchDropdown(false)

    if ((user?._id || user?.id) === profileId) {
      navigate('/profile')
      return
    }

    navigate(`/users/${profileId}`)
  }

  const shouldShowDropdown = showSearchDropdown && searchQuery.trim()
  const filteredResults = searchResults.filter((profile) => (profile._id || profile.id) !== (user?._id || user?.id))


  return (
    <div className='glass-panel flex h-[calc(100vh-7rem)] w-64 flex-col rounded-[28px] p-5 text-white'>
      <div className='mb-6 rounded-[24px] border border-white/10 bg-white/5 p-4'>
        <p className='text-xs uppercase tracking-[0.28em] text-slate-400'>Your corner</p>
        <div className='mt-3 flex items-center gap-3'>
          <img src={user.avatar} alt="avatar" className='h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10' />
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-white'>{user.username}</p>
            <p className='truncate text-xs text-slate-400'>{user.email}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
     <button onClick={() => navigate('/posts')} className={navItemClass('/posts')}>
       <RiHome2Line className='text-lg'/>
      <p>Home Feed</p>
     </button>
     <button onClick={() => navigate('/profile')} className={navItemClass('/profile')}>
       <CgProfile className='text-lg'/>
      <p>My Profile</p>
     </button>
     <div ref={searchContainerRef} className='relative'>
     <div className='flex items-center gap-2 rounded-2xl border border-white/10 bg-[#1a2435] px-3 py-3'>
     <FaSearch className='w-3 text-slate-400'/>
     <input
       type='search'
       className='w-full border-none bg-transparent text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none'
       placeholder='search profile...'
       value={searchQuery}
       onFocus={() => {
         if (searchQuery.trim()) {
           setShowSearchDropdown(true)
         }
       }}
       onChange={(event) => {
         setSearchQuery(event.target.value)
         setShowSearchDropdown(true)
       }}
     />
     </div>
     {shouldShowDropdown ? (
      <div className='absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#101826] shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl'>
        {isSearching ? (
          <div className='px-4 py-3 text-sm text-slate-400'>Searching profiles...</div>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((profile) => (
            <button
              key={profile._id || profile.id}
              type='button'
              className='flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5 last:border-b-0'
              onClick={() => handleOpenProfile(profile._id || profile.id)}
            >
              <img
                src={profile.avatar}
                alt={profile.username}
                className='h-10 w-10 rounded-xl object-cover ring-1 ring-white/10'
              />
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-white'>{profile.username}</p>
                <p className='truncate text-xs text-slate-400'>{profile.email}</p>
              </div>
            </button>
          ))
        ) : (
          <div className='px-4 py-3 text-sm text-slate-400'>No matching profiles found.</div>
        )}
      </div>
     ) : null}
     </div>
      </div>
      <div className='mt-6 flex flex-col gap-3'>
        <button onClick={() => navigate('/create-post')} className={createPostClass}>
        <IoAtCircleOutline className='text-lg'/>
        <p>Create Post</p>
        </button>
      </div>
      <div className='mt-auto rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,122,89,0.18),rgba(83,216,251,0.12))] p-3'>
        <p className='mb-3 text-sm text-slate-200'>Ready for a break?</p>
        <button onClick={handleLogout} className='flex w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#1a2435] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#222f45]'>
          <img src={user.avatar} alt="avatar" className='h-9 w-9 rounded-xl object-cover'/>
          <p>Logout</p>
        </button>
      </div>
    </div>
  )
}

export default SideBar
