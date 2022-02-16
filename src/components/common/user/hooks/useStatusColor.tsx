// import React from 'react'
import type { MeSchema } from '../../../../api/schema/model'
import { useThemeActionHook } from '../../../../atoms/settingState'

export const useStatusColor = (user?: MeSchema) => {
  const { getVariable } = useThemeActionHook()

  return user?.status?.presence !== 'invisible'
    ? user?.status?.presence === 'busy'
      ? getVariable('status-busy')
      : getVariable('status-online')
    : getVariable('status-invisible')
}
