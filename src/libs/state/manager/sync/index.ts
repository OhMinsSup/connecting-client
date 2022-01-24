import type { State } from '../..'
import type { PersistentInterface } from '../interface/persistent'
import type { StoreInterface } from '../interface/store'

export type SyncKeys = 'theme' | 'appearance' | 'locale' | 'notifications'

export const SYNC_KEYS: SyncKeys[] = ['theme', 'appearance', 'locale', 'notifications']

export interface Data {
  disabled: SyncKeys[]
  revision: {
    [key: string]: number
  }
}

export class Sync implements StoreInterface, PersistentInterface<Data> {
  private _id = 'sync'

  private _state: State

  constructor(state: State) {
    this._state = state
  }

  get id() {
    return this._id
  }

  toJSON() {
    return {}
  }

  hydrate() {
    console.log('hydrate')
  }
}
