import React from 'react'
import classNames from 'classnames'
import styles from '../../../assets/styles/modules/button.module.scss'

// utils
import { isTouchscreenDevice } from '../../../libs/utils/utils'
import { isEmpty } from '../../../libs/utils'

// hooks
import { useChannlesDeleteMutation } from '../../../api/mutations/channel'
import { useSWRConfig } from 'swr'

// components
import IconButton from '../../ui/Icon/IconButton'
import { ChannelIcon } from '../icon'

// icon
import { X } from '@styled-icons/boxicons-regular'

// constatns
import { API_ENDPOINTS } from '../../../constants'

// types
import type { ButtonItemProps } from './ButtonItem'
import type { ChannelListSchema } from '../../../api/schema/channle'

interface ChannelButtonItemProps extends ButtonItemProps {
  workspaceIdx?: string | number | null
  channel: ChannelListSchema
  user?: ChannelListSchema['owner']
  compact?: boolean
}

const ChannelButtonItem: React.FC<ChannelButtonItemProps> = ({ workspaceIdx, active, alert, margin, compact, alertCount, user, channel, ...divProps }) => {
  const { mutate: mutateAync } = useChannlesDeleteMutation()
  const { mutate } = useSWRConfig()

  const onClickDeleteForChannel = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!workspaceIdx || !channel.idx) return

    const result = await mutateAync(workspaceIdx, channel.idx)

    if (result && result.ok) {
      mutate(API_ENDPOINTS.CHANNELS.ROOT(workspaceIdx)) // revalidate workspace list
    }
  }

  if (channel.channelType === 'savedMessages') throw 'Invalid channel type.'
  if (channel.channelType === 'direct') {
    if (isEmpty(user)) throw 'No user provided.'
    // return null
  }

  const alerting = alert && !active

  return (
    <div {...divProps} data-active={active} aria-label={channel.name} className={classNames(styles.item, { [styles.compact]: compact })}>
      <ChannelIcon className={styles.avatar} target={channel} size={compact ? 24 : 32} />
      <div className={styles.name}>
        <div>{channel.name}</div>
        {channel.channelType === 'group' && <div className={styles.subText}>멤버 {channel.memberCount}명</div>}
      </div>
      <div className={styles.button}>
        {alerting && (
          <div className={styles.alert} data-style={alert}>
            {alertCount}
          </div>
        )}
        {!isTouchscreenDevice && channel.channelType === 'group' && (
          <IconButton className={styles.icon} onClick={onClickDeleteForChannel}>
            <X size={24} />
          </IconButton>
        )}
      </div>
    </div>
  )
}

export default ChannelButtonItem
