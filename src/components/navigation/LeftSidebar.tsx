import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { SIDEBAR_CHANNELS, useLayoutActionHook } from '../../atoms/layoutState'
import { isTouchscreenDevice } from '../../libs/utils/utils'
import HomeSidebar from './HomeSidebar'
import ServerListSidebar from './ServerListSidebar'
import SidebarBase from './SidebarBase'

interface LeftSidebarProps {}
const LeftSidebar: React.FC<LeftSidebarProps> = () => {
  const { getSectionState } = useLayoutActionHook()
  const isOpen = isTouchscreenDevice || getSectionState(SIDEBAR_CHANNELS, true)

  return (
    <SidebarBase>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ServerListSidebar />
              {isOpen && <HomeSidebar />}
            </>
          }
        />
      </Routes>
    </SidebarBase>
  )
}

export default LeftSidebar
