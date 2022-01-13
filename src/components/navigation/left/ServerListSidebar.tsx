import React from 'react'
import { useLocation } from 'react-location'
import styled, { css } from 'styled-components'

// utils
import { isTouchscreenDevice } from '../../../libs/utils/utils'

// components
// import ConditionalLink from '../../common/ConditionalLink'

interface ServerListSidebarProps {}
const ServerListSidebar: React.FC<ServerListSidebarProps> = () => {
  const { current: location } = useLocation()
  const homeActive = !location.pathname.startsWith('/invite')

  return (
    <ServersBase>
      <ServerList>
        {/* to={lastOpened.home ? `/channel/${lastOpened.home}` : "/"} */}
        {/* <ConditionalLink condition={homeActive} to="/"> */}
        <ServerEntry home active={homeActive}>
          <Swoosh />
          <div>
            {/* <UserHover user={client.user}>
                <Icon size={42} unread={homeUnread} count={alertCount}>
                  <UserIcon target={client.user} size={32} status hover />
                </Icon>
              </UserHover> */}
            Icon
          </div>
        </ServerEntry>
        {/* </ConditionalLink> */}
      </ServerList>
    </ServersBase>
  )
}

export default ServerListSidebar

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            style={{ textAlign: 'center' }}
            textAnchor="middle"
            fontSize={'7.5'}
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

const ServersBase = styled.div`
  width: 56px;
  height: 100%;
  padding-left: 2px;
  display: flex;
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
  height: 58px;
  display: flex;
  align-items: center;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SettingsButton = styled.div`
  width: 50px;
  height: 56px;
  display: grid;
  place-items: center;
`

function Swoosh() {
  return (
    <span>
      <svg width="54" height="106" viewBox="0 0 54 106" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M54 53C54 67.9117 41.9117 80 27 80C12.0883 80 0 67.9117 0 53C0 38.0883 12.0883 26 27 26C41.9117 26 54 38.0883 54 53Z"
          fill="var(--sidebar-active)"
        />
        <path d="M27 80C4.5 80 54 53 54 53L54.0001 106C54.0001 106 49.5 80 27 80Z" fill="var(--sidebar-active)" />
        <path d="M27 26C4.5 26 54 53 54 53L53.9999 0C53.9999 0 49.5 26 27 26Z" fill="var(--sidebar-active)" />
      </svg>
    </span>
  )
}
