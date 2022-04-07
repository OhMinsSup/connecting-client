import React from 'react'

// utils
import { getThumbnail } from '../../../libs/utils/utils'

// icon
import { Hash } from '@styled-icons/boxicons-regular'
import { ImageIconBase } from './IconBase'

// types
import type { IconBaseProps } from './IconBase'
import type { ChannelListSchema } from '../../../api/schema/channle'

interface ChannelIconProps extends IconBaseProps<ChannelListSchema>, Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'as'> {
  isServerChannel?: boolean
}

const ChannelIcon: React.FC<ChannelIconProps> = (props) => {
  const { size, target, attachment, isServerChannel: server, animate, ...imgProps } = props
  const iconURL = getThumbnail(target?.owner.profile)
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
