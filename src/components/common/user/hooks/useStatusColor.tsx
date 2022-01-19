// import React from 'react'
import type { UserSchema } from '../../../../api/schema/model'

export const useStatusColor = (user: UserSchema) => {
  console.log(user)
  //   const theme = useApplicationState().settings.theme
  //   return user?.online && user?.status?.presence !== Presence.Invisible
  //     ? user?.status?.presence === Presence.Idle
  //       ? theme.getVariable('status-away')
  //       : user?.status?.presence === Presence.Busy
  //       ? theme.getVariable('status-busy')
  //       : theme.getVariable('status-online')
  //     : theme.getVariable('status-invisible')
}
