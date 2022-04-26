import React from 'react'
import styled, { css } from 'styled-components'
import { Docked, OverlappingPanels } from 'react-overlapping-panels'
import { Outlet } from 'react-router-dom'

// hooks
import { useLocation } from 'react-router-dom'

// utils
import { isTouchscreenDevice } from '../../../libs/utils/utils'

// components
import LeftSidebar from './components/LeftSidebar'

const Sidebar = () => {
  const { pathname } = useLocation()

  const isWorkspaceForChannel = pathname.match(/workspace\/(\d+)\/channel\/(\d+)/)
  const inWorkspace = !!isWorkspaceForChannel
  const inSpecial = (pathname.startsWith('/friends') && isTouchscreenDevice) || pathname.startsWith('/invite') || pathname.includes('/settings')

  return (
    <Block>
      <OverlappingPanels
        width="100vw"
        height={'var(--app-height)'}
        leftPanel={inSpecial ? undefined : { width: 292, component: <LeftSidebar /> }}
        docked={isTouchscreenDevice ? Docked.None : Docked.Left}
      >
        <Wrapper borders={inWorkspace}>
          <Outlet />
        </Wrapper>
      </OverlappingPanels>
    </Block>
  )
}

export default Sidebar

const Block = styled.div`
  background-size: cover !important;
  background-position: center center !important;
`

const Wrapper = styled.div.attrs({ 'data-component': 'routes' })<{
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
