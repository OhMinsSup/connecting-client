import React from 'react'
import { Docked, OverlappingPanels } from 'react-overlapping-panels'
import styled, { css } from 'styled-components'

import LeftSidebar from '../components/navigation/LeftSidebar'

// hooks
import { Outlet, useLocation } from 'react-router-dom'

// utils
import { isTouchscreenDevice } from '../libs/utils/utils'

// modal
const WorkspaceAddModal = React.lazy(() => import('../components/modal/WorkspaceAddModal'))
const ChannelAddModal = React.lazy(() => import('../components/modal/ChannelAddModal'))

const HomePage = () => {
  const { pathname } = useLocation()

  // const fixedBottomNav = pathname === '/' || pathname === '/settings' || pathname.startsWith('/friends')
  // const inChannel = pathname.includes('/channel')
  // const fixedBottomNav = pathname === '/' || pathname === '/settings' || pathname.startsWith('/friends')
  // const inChannel = pathname.includes('/channel')
  const inServer = pathname.includes('/server')
  const inSpecial = (pathname.startsWith('/friends') && isTouchscreenDevice) || pathname.startsWith('/invite') || pathname.includes('/settings')

  return (
    <>
      <AppContainer>
        <OverlappingPanels
          width="100vw"
          height={'var(--app-height)'}
          leftPanel={inSpecial ? undefined : { width: 292, component: <LeftSidebar /> }}
          docked={isTouchscreenDevice ? Docked.None : Docked.Left}
        >
          <RoutesWrapper borders={inServer}>
            <Outlet />
          </RoutesWrapper>
        </OverlappingPanels>
      </AppContainer>
      <WorkspaceAddModal />
      <ChannelAddModal />
    </>
  )
}

export default HomePage

const AppContainer = styled.div`
  background-size: cover !important;
  background-position: center center !important;
`

const RoutesWrapper = styled.div.attrs({ 'data-component': 'routes' })<{
  borders: boolean
}>`
  min-width: 0;
  display: flex;
  position: relative;
  flex-direction: column;

  background: var(--primary-background);

  ${() =>
    isTouchscreenDevice &&
    css`
      overflow: hidden;
    `}

  ${(props) =>
    props.borders &&
    css`
      border-start-start-radius: 8px;
    `}
`
