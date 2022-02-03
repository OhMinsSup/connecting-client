import { ConnectingStorage } from '../libs/storage'
import { isEmpty } from '../libs/utils'
// import { settingState } from './settingState'

import type { MutableSnapshot } from 'recoil'
import type { DataSync } from './type/sync'
import type { SettingState } from './settingState'

const persistent = ['setting', 'sync']

const hydrateSetting = (snapshot: MutableSnapshot, data: SettingState, revision: number) => {
  console.log('[recoilInitializer] hydrateSetting ======>', data, revision)

  for (const key of Object.keys(data)) {
    const safeKey = key as keyof SettingState
    const value = data[safeKey]
    console.log('[recoilInitializer] hydrateSetting ======>', safeKey, value)
  }
}

const hydrate = async (snapshot: MutableSnapshot) => {
  const sync = await ConnectingStorage.getItem<DataSync>('sync')
  const { revision } = isEmpty(sync) ? ({ revision: {} } as any) : sync
  for (const id of persistent) {
    if (id === 'sync') continue
    const data = await ConnectingStorage.getItem<any>(id)
    if (typeof data === 'object' && !isEmpty(data)) {
      switch (id) {
        case 'setting':
          hydrateSetting(snapshot, data, revision?.[id] ?? +new Date())
          break
        default:
          break
      }
    }
  }
}

export const recoilInitializer = (snapshot: MutableSnapshot) => {
  // Load MobX store.
  console.log('Loading store...', snapshot)
  hydrate(snapshot)

  return null
}
