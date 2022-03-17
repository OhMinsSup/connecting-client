import React from 'react'
import classNames from 'classnames'
import styles from './styles/button.module.scss'

// utils
import { isTouchscreenDevice } from '../../../libs/utils/utils'
import { isEmpty } from '../../../libs/utils'

// components
import IconButton from '../../ui/IconButton'
import { ChannelIcon } from '../icon'

// icon
import { X } from '@styled-icons/boxicons-regular'

// types
import type { ChannelSchema, UserSchema } from '../../../api/schema/model'
import type { ButtonItemProps } from './ButtonItem'

interface ChannelButtonItemProps extends ButtonItemProps {
  channel: ChannelSchema
  user?: UserSchema
  compact?: boolean
}

const ChannelButtonItem: React.FC<ChannelButtonItemProps> = ({ active, alert, margin, compact, alertCount, user, channel, ...divProps }) => {
  if (channel.channelType === 'savedMessages') throw 'Invalid channel type.'
  if (channel.channelType === 'direct') {
    if (isEmpty(user)) throw 'No user provided.'
    // return null
  }

  return (
    <div {...divProps} data-active={active} aria-label={channel.name} className={classNames(styles.item, { [styles.compact]: compact })}>
      <ChannelIcon className={styles.avatar} target={channel} size={compact ? 24 : 32} />
      <div className={styles.name}>
        <div>{channel.name}</div>
        {channel.channelType === 'group' && <div className={styles.subText}>멤버 {channel.members.length}명</div>}
      </div>
      <div className={styles.button}>
        {/* {alerting && (
          <div className={styles.alert} data-style={alert}>
            {alertCount}
          </div>
        )} */}
        {!isTouchscreenDevice && channel.channelType === 'group' && (
          <IconButton className={styles.icon}>
            <X size={24} />
          </IconButton>
        )}
      </div>
    </div>
  )
}

export default ChannelButtonItem
