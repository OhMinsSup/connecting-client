import React from 'react'

// hooks
import { useLocation } from 'react-router-dom'

// components
import SidebarBase from './SidebarBase'
import WorkspacesList from './WorkspacesList'

// hooks
import { SIDEBAR_CHANNELS, useLayoutActionHook } from '../../../../atoms/layoutState'

// utils
import { isTouchscreenDevice } from '../../../../libs/utils/utils'
import HomeSidebar from './HomeSidebar'

const LeftSidebar: React.FC = () => {
  const { pathname } = useLocation()
  const { getSectionState } = useLayoutActionHook()
  const isOpen = isTouchscreenDevice || getSectionState(SIDEBAR_CHANNELS, true)

  const isHome = pathname.match(/^\/$/)
  const isWorkspaceForChannel = pathname.match(/workspace\/(\d+)\/channel\/(\d+)/)

  const Sidebar = () => {
    if ([isHome, isWorkspaceForChannel].some(Boolean) && isOpen) {
      return <HomeSidebar />
    }

    return null
  }

  return (
    <SidebarBase>
      <WorkspacesList />
      {Sidebar()}
    </SidebarBase>
  )
}

export default LeftSidebar
