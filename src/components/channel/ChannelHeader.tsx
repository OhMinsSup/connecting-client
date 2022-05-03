import React from 'react'
import styled from 'styled-components'

// hooks
import { useStatusColor } from '../../hooks/useStatusColor'

// components
import UserStatus from '../ui/User/UserStatus'
import { At, Hash } from '@styled-icons/boxicons-regular'
import { Notepad, Group } from '@styled-icons/boxicons-solid'
import { PageHeader } from '../ui/Layout/Header'

// utils
import { isTouchscreenDevice } from '../../libs/utils/utils'

import type { ChannelSchema, UserSchema } from '../../api/schema/model'

interface ChannelHeaderProps {
  channel: ChannelSchema
  toggleSidebar?: () => void
  toggleChannelSidebar?: () => void
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel }) => {
  const name = channel.name || '채널 없음'
  let icon = undefined
  let recipient: UserSchema | undefined
  switch (channel.channelType) {
    case 'savedMessages':
      icon = <Notepad size={24} />
      break
    case 'direct':
      icon = <At size={24} />
      recipient = channel.owner
      break
    case 'group':
      icon = <Group size={24} />
      break
    case 'text':
      icon = <Hash size={24} />
      break
  }

  return (
    <PageHeader icon={icon} transparent>
      <Info>
        <span className="name">{name}</span>
        {isTouchscreenDevice && channel.channelType === 'direct' && (
          <>
            <div className="divider" />
            <span className="desc">
              <div
                className="status"
                style={{
                  backgroundColor: useStatusColor(recipient),
                }}
              />
              <UserStatus user={recipient} />
            </span>
          </>
        )}
        {/* {!isTouchscreenDevice && (channel.channelType === 'group' || channel.channelType === 'text') && channel.description && (
          <>
            <div className="divider" />
            <span
              className="desc"
              onClick={() => {
                // openScreen({
                //   id: 'channel_info',
                //   channel,
                // })
              }}>
              <Markdown content={channel.description.split('\n')[0] ?? ''} disallowBigEmoji />
            </span>
          </>
        )} */}
      </Info>
      {/* <RightHeaderActionGroups channel={channel} /> */}
    </PageHeader>
  )
}

export default ChannelHeader

const Info = styled.div`
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;

  display: flex;
  gap: 8px;
  align-items: center;

  * {
    display: inline-block;
  }

  .divider {
    height: 20px;
    margin: 0 5px;
    padding-left: 1px;
    background-color: var(--tertiary-background);
  }

  .status {
    width: 10px;
    height: 10px;
    display: inline-block;
    margin-inline-end: 6px;
    border-radius: var(--border-radius-half);
  }

  .desc {
    cursor: pointer;
    margin-top: 2px;
    font-size: 0.8em;
    font-weight: 400;
    color: var(--secondary-foreground);

    > * {
      pointer-events: none;
    }
  }
`
