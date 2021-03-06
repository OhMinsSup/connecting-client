import { useThemeActionHook } from '../atoms/settingState'
import type { MeSchema, UserSchema } from '../api/schema/model'

export const useStatusColor = (user?: MeSchema | UserSchema) => {
  const { getVariable } = useThemeActionHook()

  return user?.status?.presence !== 'invisible'
    ? user?.status?.presence === 'busy'
      ? getVariable('status-busy')
      : getVariable('status-online')
    : getVariable('status-invisible')
}
