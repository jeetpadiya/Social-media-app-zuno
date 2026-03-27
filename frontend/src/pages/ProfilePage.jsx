import SideBar from '../components/SideBar'
import Profile from '../components/Profile'

const ProfilePage = () => {
  return (
    <div className="flex flex-col overflow-auto md:flex-row">
      <div className="hidden p-3 md:block">
        <SideBar />
      </div>
      <div className="flex-1 p-4">
        <Profile />
      </div>
    </div>
  )
}

export default ProfilePage
