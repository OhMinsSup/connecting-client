import React from 'react'

// hooks
import { useStatusColor } from '../../../hooks/useStatusColor'

// components
import IconBase from '../Icon/IconBase'

// utils
import { getThumbnail } from '../../../libs/utils/utils'

// types
import type { IconBaseProps } from '../Icon/IconBase'
import type { MeSchema } from '../../../api/schema/model'

interface Props extends IconBaseProps<MeSchema> {
  status?: boolean
  showWorkspaceIdentity?: boolean
}

type UserIconProps = Props & Omit<React.SVGAttributes<SVGElement>, keyof Props | 'children' | 'as'>

const UserIcon: React.FC<UserIconProps> = (props) => {
  const { target, attachment, size, status, animate, mask, hover, showWorkspaceIdentity, ...svgProps } = props
  const iconURL = getThumbnail(target?.profile)

  return (
    <IconBase {...svgProps} width={size} height={size} hover={hover} borderRadius="--border-radius-user-icon" aria-hidden="true" viewBox="0 0 32 32">
      <foreignObject x="0" y="0" width="32" height="32" className="icon" mask={mask ?? (status ? 'url(#user)' : undefined)}>
        <img src={iconURL} draggable={false} className="lazyload" />
      </foreignObject>
      {status && <circle cx="27" cy="27" r="5" fill={useStatusColor(target)} />}
    </IconBase>
  )
}

export default UserIcon
