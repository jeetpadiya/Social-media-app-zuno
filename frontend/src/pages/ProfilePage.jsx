import React from 'react'
import MainLayout from '../components/MainLayout'
import Profile from '../components/Profile'

const ProfilePage = () => {
  return (
    <MainLayout title="Profile">
      <Profile isOwnProfile={true} />
    </MainLayout>
  )
}

export default ProfilePage
