import React from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { isTouchscreenDevice } from '../../../libs/utils/utils'

// components
import { Home, UserDetail, Notepad } from '@styled-icons/boxicons-solid'
import ConditionalLink from '../../ui/ConditionalLink'
import { GenericSidebarBase, GenericSidebarList } from './SidebarBase'
import { ButtonItem } from '../../common/button'

const HomeSidebar = () => {
  const { pathname } = useLocation()
  return (
    <GenericSidebarBase>
      <Navbar>개인 메세지</Navbar>
      {/*  */}
      <GenericSidebarList>
        <ConditionalLink active={pathname === '/'} to="/">
          <ButtonItem active={pathname === '/'}>
            <Home size={20} />
            <span>홈</span>
          </ButtonItem>
        </ConditionalLink>
        {!isTouchscreenDevice && (
          <>
            <ConditionalLink active={pathname === '/friends'} to="/friends">
              <ButtonItem active={pathname === '/friends'} alert={'mention'} alertCount={0}>
                <UserDetail size={20} />
                <span>친구</span>
              </ButtonItem>
            </ConditionalLink>
          </>
        )}
        <ConditionalLink active={false} to="/open/saved">
          <ButtonItem active={false}>
            <Notepad size={20} />
            <span>저장된 메모</span>
          </ButtonItem>
        </ConditionalLink>
      </GenericSidebarList>
    </GenericSidebarBase>
  )
}

export default HomeSidebar

const Navbar = styled.div`
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-weight: 600;
  flex-shrink: 0;
  height: 48px;

  ${() =>
    isTouchscreenDevice &&
    css`
      height: 56px;
    `}
`
