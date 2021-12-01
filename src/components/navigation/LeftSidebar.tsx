import React from 'react'
import SidebarBase from './common/SidebarBase'
import ServerListSidebar from './left/ServerListSidebar'

interface LeftSidebarProps {}
const LeftSidebar: React.FC<LeftSidebarProps> = () => {
  return (
    <SidebarBase>
      <ServerListSidebar />
    </SidebarBase>
  )
}

export default LeftSidebar
