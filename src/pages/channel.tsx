import React from 'react'

// styles
import styled from 'styled-components'

// hooks
import { useParams } from 'react-router-dom'
import { useLayoutActionHook } from '../atoms/layoutState'
import { useChannleQuery } from '../api/queries/channel'

// utils
import { SIDEBAR_MEMBERS } from '../atoms/layoutState'
// import { isTouchscreenDevice } from '../libs/utils/utils'

// components
import ChannelHeader from '../components/channel/ChannelHeader'
import { Hash } from '@styled-icons/boxicons-regular'
import { Ghost } from '@styled-icons/boxicons-solid'
import { AgeGate } from '../components/ui/AgeGate'
import { PageHeader } from '../components/ui/Header'

const ChannelPage = () => {
  const { channelIdx, workspaceIdx } = useParams()
  const { getSectionState } = useLayoutActionHook()
  const sectionState = getSectionState(SIDEBAR_MEMBERS, true)

  console.log('channelIdx', channelIdx, workspaceIdx, sectionState)

  const { channel, isLoading } = useChannleQuery(workspaceIdx, channelIdx)
  console.log(channel)
  if (isLoading) {
    return (
      <PlaceholderBase>
        <PageHeader icon={<Hash size={24} />}>
          <span className="name">채널 없음</span>
        </PageHeader>

        <div className="placeholder">
          <div className="floating">
            <Ghost width={80} />
          </div>
          <div className="primary">이런, 여기에는 아무것도 없네요!</div>
          <div className="secondary">채널 없음</div>
        </div>
      </PlaceholderBase>
    )
  }

  if (!channel) return null

  return (
    <AgeGate type="channel" channel={channel} gated={!!(channel.channelType === 'text' || channel.channelType === 'group')}>
      <ChannelHeader channel={channel} />
      <ChannelMain>
        <ChannelContent>{/*  */}</ChannelContent>

        {/* {!isTouchscreenDevice && sectionState && <RightSidebar />} */}
      </ChannelMain>
    </AgeGate>
  )
}

export default ChannelPage

const ChannelMain = styled.div.attrs({ 'data-component': 'channel' })`
  flex-grow: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
  flex-direction: row;
`

const ChannelContent = styled.div.attrs({
  'data-component': 'content',
})`
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
`

const PlaceholderBase = styled.div`
  @keyframes floating {
    0% {
      transform: translate(0, 0px);
    }
    50% {
      transform: translate(0, 15px);
    }
    100% {
      transform: translate(0, -0px);
    }
  }

  flex-grow: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;

  .floating {
    animation-name: floating;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  .placeholder {
    justify-content: center;
    text-align: center;
    margin: auto;
    padding: 12px;

    .primary {
      color: var(--secondary-foreground);
      font-weight: 700;
      font-size: 22px;
      margin: 0 0 5px 0;
    }

    .secondary {
      color: var(--tertiary-foreground);
      font-weight: 400;
    }

    svg {
      margin: 2em auto;
      fill-opacity: 0.8;
    }
  }
`
