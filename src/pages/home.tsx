import React from 'react'
import { useLocation } from 'react-router-dom'
import { Docked, OverlappingPanels } from 'react-overlapping-panels'
import styled from 'styled-components'

// import Home from '../components/home/Home'
import LeftSidebar from '../components/navigation/LeftSidebar'

// utils
import { isTouchscreenDevice } from '../libs/utils/utils'

const HomePage = () => {
  const { pathname } = useLocation()

  // const fixedBottomNav = pathname === '/' || pathname === '/settings' || pathname.startsWith('/friends')
  // const inChannel = pathname.includes('/channel')
  // const fixedBottomNav = pathname === '/' || pathname === '/settings' || pathname.startsWith('/friends')
  // const inChannel = pathname.includes('/channel')
  // const inServer = pathname.includes('/server')
  const inSpecial = (pathname.startsWith('/friends') && isTouchscreenDevice) || pathname.startsWith('/invite') || pathname.includes('/settings')

  return (
    <>
      <AppContainer>
        <OverlappingPanels
          width="100%"
          height={'var(--app-height)'}
          leftPanel={inSpecial ? undefined : { width: 292, component: <LeftSidebar /> }}
          docked={isTouchscreenDevice ? Docked.None : Docked.Left}
        >
          Home component
        </OverlappingPanels>
      </AppContainer>
    </>
  )
}

export default HomePage

const AppContainer = styled.div`
  background-size: cover !important;
  background-position: center center !important;
`
