import React from 'react'

// components
import Tooltip from '../Tooltip'

// types
import type { MeSchema, UserSchema } from '../../../api/schema/model'

interface UserStatusProps {
  user?: MeSchema | UserSchema | null
  tooltip?: boolean
}

const UserStatus: React.FC<UserStatusProps> = ({ user, tooltip }) => {
  let text = undefined
  let component = undefined

  switch (user?.status?.presence) {
    case 'online':
      text = '온라인'
      break
    case 'busy':
      text = '다른 용무 중'
      break
    case 'invisible':
      text = '오프라인으로 표시'
      break
    case 'offline':
      text = '오프라인'
      break
    default:
      text = user?.status?.text
      break
  }

  if (tooltip) {
    component = (
      <Tooltip arrow={undefined} content={text}>
        {text}
      </Tooltip>
    )
  } else {
    component = <span>{text}</span>
  }

  return <>{component}</>
}

export default UserStatus
