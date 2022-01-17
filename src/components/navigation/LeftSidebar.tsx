import React from 'react'
import { ServerListSidebar, SidebarBase } from './ui'

interface LeftSidebarProps {}
const LeftSidebar: React.FC<LeftSidebarProps> = () => {
  return (
    <SidebarBase>
      {/* path: "/" */}
      <ServerListSidebar />
    </SidebarBase>
  )
}

export default LeftSidebar
