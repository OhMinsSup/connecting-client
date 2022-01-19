import { MemoryStorage } from '../../../storage'
import { Theme } from './theme'
import { Sound } from './sound'
import { Security } from './security'

import type { PersistentInterface } from '../interface/persistent'
import type { StoreInterface } from '../interface/store'
import type { SyncableInterface } from '../interface/syncable'
import type { SettingManagerState } from './types'

export class Setting implements StoreInterface, PersistentInterface<SettingManagerState>, SyncableInterface {
  private _id = 'setting'

  private _data: MemoryStorage

  _theme: Theme // 각각 객체로 관리
  _sounds: Sound // 각각 객체로 관리
  _security: Security // 각각 객체로 관리

  constructor() {
    this._data = new MemoryStorage()

    this._theme = new Theme(this)
    this._sounds = new Sound()
    this._security = new Security()
  }

  get id() {
    return this._id
  }

  get theme() {
    return this._theme
  }

  get sound() {
    return this._sounds
  }

  get security() {
    return this._security
  }

  toJSON(): unknown {
    return {}
  }

  set<T extends keyof SettingManagerState>(key: T, value: SettingManagerState[T]) {
    this._data.setItem(key, value)
  }

  remove<T extends keyof SettingManagerState>(key: T): void {
    this._data.removeItem(key)
  }

  get<T extends keyof SettingManagerState>(key: T, defaultValue?: SettingManagerState[T]): SettingManagerState[T] {
    return this._data.getItem(key) ?? defaultValue
  }

  private pullKeys(keys: (keyof SettingManagerState)[]) {
    const obj: Partial<SettingManagerState> = {}
    keys.forEach((key) => {
      const value = this.get(key)
      if (!value) return
      obj[key] = value
    })
    return obj
  }

  hydrate(data: SettingManagerState): void {
    Object.keys(data).forEach((key) => typeof (data as any)[key] !== 'undefined' && this._data.setItem(key, (data as any)[key]))
  }

  apply(key: 'appearance' | 'theme', data: unknown) {
    if (key === 'appearance') {
      this.remove('appearance:emoji')
      this.remove('appearance:seasonal')
      this.remove('appearance:transparency')
    } else {
      this.remove('appearance:ligatures')
      this.remove('appearance:theme:base')
      this.remove('appearance:theme:css')
      this.remove('appearance:theme:font')
      this.remove('appearance:theme:light')
      this.remove('appearance:theme:monoFont')
      this.remove('appearance:theme:overrides')
    }

    const safeData = data as SettingManagerState
    this.hydrate(safeData)
  }

  toSyncable() {
    const data: Record<'appearance' | 'theme', Partial<SettingManagerState>> = {
      appearance: this.pullKeys(['appearance:emoji', 'appearance:seasonal', 'appearance:transparency']),
      theme: this.pullKeys([
        'appearance:ligatures',
        'appearance:theme:base',
        'appearance:theme:css',
        'appearance:theme:font',
        'appearance:theme:light',
        'appearance:theme:monoFont',
        'appearance:theme:overrides',
      ]),
    }
    return data
  }
}
