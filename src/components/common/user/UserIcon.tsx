import React from 'react'
import { useParams } from 'react-router-dom'
import { useStatusColor } from './hooks/useStatusColor'

import IconBase from '../../ui/IconBase'

import type { IconBaseProps } from '../../ui/IconBase'
import type { MeSchema } from '../../../api/schema/model'

interface Props extends IconBaseProps<MeSchema> {
  status?: boolean
  // TODO: Voice Type
  voice?: any
  // TODO: Masquerading Type
  masquerade?: any
  showWorkspaceIdentity?: boolean
}

type UserIconProps = Props & Omit<React.SVGAttributes<SVGElement>, keyof Props | 'children' | 'as'>

const UserIcon: React.FC<UserIconProps> = (props) => {
  const { target, attachment, size, status, animate, mask, hover, showWorkspaceIdentity, masquerade, ...svgProps } = props
  let { url } = props

  const params = useParams<{ workspaceId?: string }>()

  if (masquerade?.avatar) {
    url = masquerade.avatar
  } else if (!url) {
    // let override
    if (target && showWorkspaceIdentity) {
      // TODO: workspace인 경우에만 사용하도록 하자 (아직 안함) - 워크스페이스 이미지
      if (params.workspaceId) {
        // const member = target.members.find((m) => m.workspaceId === workspaceId)
        // if (member?.avatar) {
        //   override = member?.avatar
        // }
      }
    }

    // url = client.generateFileURL(override ?? target?.avatar ?? attachment, { max_side: 256 }, animate) ?? (target ? target.defaultAvatarURL : fallback)
    url = 'https://api.revolt.chat/users/01FNRRTRS58DCD1B9XBAT6MBRT/default_avatar'
  }

  return (
    <IconBase {...svgProps} width={size} height={size} hover={hover} borderRadius="--border-radius-user-icon" aria-hidden="true" viewBox="0 0 32 32">
      <foreignObject x="0" y="0" width="32" height="32" className="icon" mask={mask ?? (status ? 'url(#user)' : undefined)}>
        <img src={url} draggable={false} className="lazyload" />
      </foreignObject>
      {status && <circle cx="27" cy="27" r="5" fill={useStatusColor(target)} />}
    </IconBase>
  )
}

export default UserIcon
