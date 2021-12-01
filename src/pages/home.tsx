import React from 'react'
import { useLocation } from 'react-location'
import { Docked, OverlappingPanels } from 'react-overlapping-panels'
// import styled from 'styled-components'

import Home from '../components/home/Home'
import LeftSidebar from '../components/navigation/LeftSidebar'

// utils
import { isTouchscreenDevice } from '../libs/utils/utils'

const HomePage = () => {
  const { current: location } = useLocation()
  const { pathname } = location

  // const fixedBottomNav = pathname === '/' || pathname === '/settings' || pathname.startsWith('/friends')
  // const inChannel = pathname.includes('/channel')
  const inSpecial = (pathname.startsWith('/friends') && isTouchscreenDevice) || pathname.startsWith('/invite') || pathname.includes('/settings')

  return (
    <>
      <OverlappingPanels
        width="100%"
        height={'var(--app-height)'}
        leftPanel={inSpecial ? undefined : { width: 292, component: <LeftSidebar /> }}
        docked={isTouchscreenDevice ? Docked.None : Docked.Left}
      >
        <Home />
      </OverlappingPanels>
    </>
  )
}

export default HomePage
