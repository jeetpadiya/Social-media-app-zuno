import SideBar from '../components/SideBar'
import Profile from '../components/Profile'

const ProfilePage = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col overflow-auto px-4 py-6 md:flex-row md:gap-6">
      <div className="hidden md:block md:shrink-0">
        <SideBar />
      </div>
      <div className="flex-1">
        <Profile />
      </div>
    </div>
  )
}

export default ProfilePage
