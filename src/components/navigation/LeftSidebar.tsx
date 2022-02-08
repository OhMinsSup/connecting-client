import React from 'react'
// import { isTouchscreenDevice } from '../../libs/utils/utils'
import { ServerListSidebar, SidebarBase } from './ui'

interface LeftSidebarProps {}
const LeftSidebar: React.FC<LeftSidebarProps> = () => {
  // const isOpen = isTouchscreenDevice || layout.getSectionState(SIDEBAR_CHANNELS, true)

  return (
    <SidebarBase>
      {/* path: "/" */}
      <ServerListSidebar />
    </SidebarBase>
  )
}

export default LeftSidebar
