import React from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Swoosh } from '.'
import ConditionalLink from '../../ui/ConditionalLink'

import { isTouchscreenDevice } from '../../../libs/utils/utils'

const ServerListSidebar = () => {
  const { pathname } = useLocation()

  const homeActive = !pathname.startsWith('/invite')

  return (
    <ServersBase>
      <ServerList>
        <ConditionalLink active={homeActive} to={'/'}>
          <ServerEntry home active={homeActive}>
            <Swoosh />
            <div>123123</div>
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
