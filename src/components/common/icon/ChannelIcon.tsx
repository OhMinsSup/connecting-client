import React from 'react'

// icon
import { Hash } from '@styled-icons/boxicons-regular'
import { ImageIconBase } from '../../ui/IconBase'

// types
import type { ChannelSchema } from '../../../api/schema/model'
import type { IconBaseProps } from '../../ui/IconBase'

interface ChannelIconProps extends IconBaseProps<ChannelSchema>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'as'> {
  isServerChannel?: boolean
}

const ChannelIcon: React.FC<ChannelIconProps> = (props) => {
  const { size, target, attachment, isServerChannel: server, animate, ...imgProps } = props
  const iconURL = 'https://api.revolt.chat/users/01FNRRTRS58DCD1B9XBAT6MBRT/default_avatar'
  const isServerChannel = server || (target && target.channelType === 'text')

  if (typeof iconURL === 'undefined') {
    if (isServerChannel) {
      return <Hash size={size} />
    }
  }

  let borderRadius: string | undefined = '--border-radius-channel-icon'
  if (isServerChannel) {
    borderRadius = undefined
  }

  return <ImageIconBase {...imgProps} width={size} height={size} loading="lazy" aria-hidden="true" borderRadius={borderRadius} src={iconURL} />
}

export default ChannelIcon
