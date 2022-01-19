import React from 'react'
import IconBase from '../../ui/IconBase'

import type { IconBaseProps } from '../../ui/IconBase'
import type { UserSchema } from '../../../api/schema/model'

interface Props extends IconBaseProps<UserSchema> {
  status?: boolean
  // TODO: Voice Type
  voice?: any
  // TODO: Masquerading Type
  masquerade?: any
  showServerIdentity?: boolean
}

type UserIconProps = Props & Omit<React.SVGAttributes<SVGElement>, keyof Props | 'children' | 'as'>

const UserIcon: React.FC<UserIconProps> = (props) => {
  const { target, attachment, url, size, status, animate, mask, hover, ...svgProps } = props
  return (
    <IconBase {...svgProps} width={size} height={size} hover={hover} borderRadius="--border-radius-user-icon" aria-hidden="true" viewBox="0 0 32 32">
      <foreignObject x="0" y="0" width="32" height="32" className="icon" mask={mask ?? (status ? 'url(#user)' : undefined)}>
        <img src={url} draggable={false} className="lazyload" />
      </foreignObject>
      Base
    </IconBase>
  )
}

export default UserIcon
