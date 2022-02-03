// import React from 'react'
import type { UserSchema } from '../../../../api/schema/model'
import { useThemeActionHook } from '../../../../atoms/settingState'

export const useStatusColor = (user?: UserSchema) => {
  const { getVariable } = useThemeActionHook()

  return user?.status?.presence !== 'invisible'
    ? user?.status?.presence === 'busy'
      ? getVariable('status-busy')
      : getVariable('status-online')
    : getVariable('status-invisible')
}
