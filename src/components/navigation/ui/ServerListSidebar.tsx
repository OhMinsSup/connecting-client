import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Swoosh } from '.'
import ConditionalLink from '../../ui/ConditionalLink'

import { isTouchscreenDevice } from '../../../libs/utils/utils'
import UserIcon from '../../common/user/UserIcon'
import UserHover from '../../common/user/UserHover'

const ServerListSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const homeActive = !pathname.startsWith('/invite')

  return (
    <ServersBase>
      <ServerList>
        <ConditionalLink active={homeActive} to={'/'}>
          <ServerEntry home active={homeActive}>
            <Swoosh />
            <div onContextMenu={() => console.log('???')} onClick={() => homeActive && navigate('/settings')}>
              <UserHover>
                <Icon size={42} unread={undefined} count={0}>
                  <UserIcon target={undefined} size={32} status hover />
                </Icon>
              </UserHover>
            </div>
          </ServerEntry>
        </ConditionalLink>
      </ServerList>
    </ServersBase>
  )
}

export default ServerListSidebar

const ServersBase = styled.div`
  width: 58px;
  height: 100%;
  padding-inline-start: 2px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  ${isTouchscreenDevice &&
  css`
    padding-bottom: 50px;
  `}
`

const ServerList = styled.div`
  flex-grow: 1;
  display: flex;
  overflow-y: scroll;
  padding-bottom: 20px;
  flex-direction: column;
  scrollbar-width: none;
  > :first-child > svg {
    margin: 6px 0 6px 4px;
  }
  &::-webkit-scrollbar {
    width: 0px;
  }
`

const ServerEntry = styled.div<{ active: boolean; home?: boolean }>`
  height: 54px;
  display: flex;
  align-items: center;
  //transition: 0.2s ease height;
  :focus {
    outline: 3px solid blue;
  }
  > div {
    height: 42px;
    padding-inline-start: 6px;
    display: grid;
    place-items: center;
    border-start-start-radius: 50%;
    border-end-start-radius: 50%;
    &:active {
      transform: translateY(1px);
    }
    ${(props) =>
      props.active &&
      css`
        &:active {
          transform: none;
        }
      `}
  }
  > span {
    width: 0;
    display: relative;
    ${(props) =>
      !props.active &&
      css`
        display: none;
      `}
    svg {
      margin-top: 5px;
      pointer-events: none;
    }
  }
  ${(props) =>
    (!props.active || props.home) &&
    css`
      cursor: pointer;
    `}
`

function Icon({ children, unread, count, size }: { children: React.ReactNode; unread?: 'mention' | 'unread'; count: number | 0; size: number }) {
  return (
    <svg width={size} height={size} aria-hidden="true" viewBox="0 0 32 32">
      <use href="#serverIndicator" />
      <foreignObject x="0" y="0" width="32" height="32" mask={unread ? 'url(#server)' : undefined}>
        {children}
      </foreignObject>
      {unread === 'unread' && <circle cx="27" cy="5" r="5" fill={'white'} />}
      {unread === 'mention' && (
        <>
          <circle cx="27" cy="5" r="5" fill={'var(--error)'} />
          <text
            x="27"
            y="5"
            r="5"
            fill={'white'}
            fontSize={'7.5'}
            fontWeight={600}
            textAnchor="middle"
            alignmentBaseline={'middle'}
            dominantBaseline={'middle'}
          >
            {count < 10 ? count : '9+'}
          </text>
        </>
      )}
    </svg>
  )
}
