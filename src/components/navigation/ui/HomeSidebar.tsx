import React, { useId, useEffect } from 'react'
import styled, { css } from 'styled-components'

// utils
import { isTouchscreenDevice } from '../../../libs/utils/utils'

// constants
import { MODAL_TYPE, PAGE_ENDPOINTS } from '../../../constants'

// components
import { Home, UserDetail, Notepad } from '@styled-icons/boxicons-solid'
import ConditionalLink from '../../ui/ConditionalLink'
import { GenericSidebarBase, GenericSidebarList } from './SidebarBase'
import { ButtonItem } from '../../common/button'
import Category from '../../ui/Category'

// hooks
import { useChannlesQuery } from '../../../api/hooks/channelHook'
import { useLayoutActionHook } from '../../../atoms/layoutState'
import { useLocation, useParams } from 'react-router-dom'
import useUrlState from '../../../hooks/useUrlState'

const HomeSidebar = () => {
  const { pathname } = useLocation()

  const { channelIdx } = useParams<{ channelIdx: string }>()

  const { channels } = useChannlesQuery()

  const [state, setState] = useUrlState(
    {
      modalType: null,
    },
    {
      navigateMode: 'replace',
    },
  )

  console.log('HomeSidebar', state)

  const { setLastHomePath } = useLayoutActionHook()

  const id = useId()

  // 저장된 메모 불러오기
  const savedMessages = channels.filter((channel) => channel.channelType === 'savedMessages')

  // 저장된 메모를 제외한 채널 리스트
  const channelList = channels.filter((x) => ['direct', 'group'].includes(x.channelType))

  // 사용자가 마지막으로 방문한 페이지를 추적합니다(홈 페이지에서).
  useEffect(() => setLastHomePath(pathname), [pathname])

  // 채널 생성 모달 생성
  const onClickOpen = () => {
    setState({ modalType: MODAL_TYPE.CREATE_CHANNEL })
  }

  return (
    <GenericSidebarBase>
      <Navbar>개인 메세지</Navbar>
      <GenericSidebarList>
        <ConditionalLink active={pathname === PAGE_ENDPOINTS.INDEX} to={PAGE_ENDPOINTS.INDEX}>
          <ButtonItem active={pathname === PAGE_ENDPOINTS.INDEX}>
            <Home size={20} />
            <span>홈</span>
          </ButtonItem>
        </ConditionalLink>
        {!isTouchscreenDevice && (
          <>
            <ConditionalLink active={pathname === PAGE_ENDPOINTS.FRIENDS.ROOT} to={PAGE_ENDPOINTS.FRIENDS.ROOT}>
              <ButtonItem active={pathname === PAGE_ENDPOINTS.FRIENDS.ROOT} alert={'mention'} alertCount={0}>
                <UserDetail size={20} />
                <span>친구</span>
              </ButtonItem>
            </ConditionalLink>
          </>
        )}
        {savedMessages.map((channel) => {
          const to = PAGE_ENDPOINTS.CHANNEL.DETAIL(channel.idx)
          const active = channelIdx ? to === PAGE_ENDPOINTS.CHANNEL.DETAIL(channelIdx) : false

          return (
            <ConditionalLink active={active} to={to} key={`channle-${channel.idx}-${id}`}>
              <ButtonItem active={active}>
                <Notepad size={20} />
                <span>저장된 메모</span>
              </ButtonItem>
            </ConditionalLink>
          )
        })}
        <Category text="대화" action={onClickOpen} />
        {channelList.map((channel) => {
          const to = PAGE_ENDPOINTS.CHANNEL.DETAIL(channel.idx)
          const active = channelIdx ? to === PAGE_ENDPOINTS.CHANNEL.DETAIL(channelIdx) : false

          return (
            <ConditionalLink key={`channle-${channel.idx}-${id}`} active={active} to={to}>
              {channel.name}
            </ConditionalLink>
          )
        })}
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
