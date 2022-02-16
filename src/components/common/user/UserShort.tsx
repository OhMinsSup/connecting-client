import React from 'react'

import type { MeSchema } from '../../../api/schema/model'

interface UserShortProps extends React.HTMLAttributes<HTMLSpanElement> {
  user?: MeSchema | null
  prefixAt?: boolean
}

function UserShort({ user, prefixAt, ...reset }: UserShortProps) {
  return (
    <span {...reset}>
      {prefixAt ? '@' : undefined}
      {user?.profile?.nickname}
    </span>
  )
}

export default UserShort
