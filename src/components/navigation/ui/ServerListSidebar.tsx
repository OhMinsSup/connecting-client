import React from 'react'
import { Cog } from '@styled-icons/boxicons-solid'
import { Plus } from '@styled-icons/boxicons-regular'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Swoosh } from '.'

import ConditionalLink from '../../ui/ConditionalLink'
import IconButton from '../../ui/IconButton'
import UserIcon from '../../common/user/UserIcon'
import UserHover from '../../common/user/UserHover'
import LineDivider from '../../ui/LineDivider'
import Tooltip from '../../ui/Tooltip'
import ServerIcon from '../../common/server/ServerIcon'

// utils
import { isTouchscreenDevice } from '../../../libs/utils/utils'

// hooks
import { useWorkspacesQuery } from '../../../api/hooks/workspaceHook'
import { useProfileQuery } from '../../../atoms/authState'

// https://developers.revolt.chat/api/#tag/Relationships

const ServerListSidebar = () => {
  const { pathname } = useLocation()
  const params = useParams<{ workspaceId?: string }>()
  const navigate = useNavigate()

  const homeActive = !pathname.startsWith('/invite')

  const { profile } = useProfileQuery()

  const { workspaces } = useWorkspacesQuery()

  return (
    <ServersBase>
      <ServerList>
        {profile?.myWorkspaces.map((item) => {
          return (
            <ConditionalLink active={homeActive} to={'/'} key={`my-workspace-${item.idx}`}>
              <ServerEntry home active={homeActive}>
                <Swoosh />
                <div onContextMenu={() => console.log('???')} onClick={() => homeActive && navigate('/settings')}>
                  <UserHover>
                    <Icon size={42} unread={undefined} count={0}>
                      <UserIcon target={profile} size={32} status hover />
                    </Icon>
                  </UserHover>
                </div>
              </ServerEntry>
            </ConditionalLink>
          )
        })}
        {/* channles */}
        <LineDivider />
        {/* servers */}
        {workspaces.map((item) => {
          const active = item.idx === Number(params.workspaceId)

          // const isUnread = server.isUnread(state.notifications)
          // const mentionCount = server.getMentions(state.notifications).length
          const isUnread = true
          const mentionCount = 0

          return (
            <ConditionalLink key={item.idx} active={active} to={'/'}>
              <ServerEntry active={active}>
                <Swoosh />
                <Tooltip content={item.name} placement="right">
                  <Icon size={42} unread={mentionCount > 0 ? 'mention' : isUnread ? 'unread' : undefined} count={mentionCount}>
                    <ServerIcon size={32} target={item} />
                  </Icon>
                </Tooltip>
              </ServerEntry>
            </ConditionalLink>
          )
        })}
        <ServerCircle>
          <Tooltip content="Add a Server" placement="right">
            <div className="circle">
              <IconButton>
                <Plus size={32} />
              </IconButton>
            </div>
          </Tooltip>
        </ServerCircle>
      </ServerList>

      {!isTouchscreenDevice && (
        <Tooltip content={'Settings'} placement="right">
          <ServerCircle>
            <Link to="/settings">
              <div className="circle">
                <IconButton>
                  <Cog size={24} fill="var(--secondary-foreground) !important" />
                </IconButton>
              </div>
            </Link>
          </ServerCircle>
        </Tooltip>
      )}
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

const ServerCircle = styled.div`
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-background);
    border-radius: 50%;
    height: 42px;
    width: 42px;
    transition: background-color 0.1s ease-in;
    cursor: pointer;

    > div svg {
      color: var(--accent);
    }

    &:active {
      transform: translateY(1px);
    }
  }
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
