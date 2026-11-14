import React from 'react'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import TopBar from './TopBar'
import TabBar from './TabBar'

const MainLayout = ({ children, showRightSidebar = true, title = 'Home' }) => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-150">
      <div className="mx-auto flex min-h-screen w-full max-w-[1265px] justify-center">
        {/* Left Desktop Sidebar */}
        <div className="hidden shrink-0 md:flex">
          <Sidebar />
        </div>

        {/* Center Content Column (max 600px) */}
        <main className="w-full max-w-[600px] min-h-screen border-x border-[var(--border)] bg-[var(--surface)] pb-16 md:pb-8 flex-1">
          {/* Mobile Top Bar */}
          <TopBar title={title} />
          {children}
        </main>

        {/* Right Desktop Sidebar */}
        {showRightSidebar && (
          <div className="hidden shrink-0 lg:flex">
            <RightSidebar />
          </div>
        )}
      </div>

      {/* Mobile Bottom Tab Bar */}
      <TabBar />
    </div>
  )
}

export default MainLayout
