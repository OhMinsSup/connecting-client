import { isEmpty } from '../utils'
import { Setting } from './manager/setting'
import { ConnectingStorage } from '../storage'
import { Sync } from './manager/sync'
import type { Data as DataSync } from './manager/sync'
import type { PersistentInterface } from './manager/interface/persistent'

export class State {
  _settings: Setting
  _sync: Sync

  private _persistent: [string, PersistentInterface<unknown>][] = []
  private _disabled: Set<string> = new Set()

  constructor() {
    this._settings = new Setting()
    this._sync = new Sync(this)

    this.register()
    this.setDisabled = this.setDisabled.bind(this)
  }

  get settings() {
    return this._settings
  }

  get sync() {
    return this._sync
  }

  private register() {
    for (const key of Object.keys(this)) {
      const obj = (this as unknown as Record<string, Record<string, unknown>>)[key]

      // Check if this is an object.
      if (typeof obj === 'object') {
        // Check if this is a Store.
        if (typeof obj.id === 'string') {
          const id = obj.id

          // Check if this is a Persistent<T>
          if (typeof obj.hydrate === 'function' && typeof obj.toJSON === 'function') {
            this._persistent.push([id, obj as unknown as PersistentInterface<unknown>])
          }
        }
      }
    }
  }

  setDisabled(key: string) {
    this._disabled.add(key)
  }

  async save() {
    for (const [id, store] of this._persistent) {
      console.log('_presistent', id, store)
      await ConnectingStorage.setItem(id, JSON.parse(JSON.stringify(store.toJSON())))
    }
  }

  /**
   * Load data stores from local storage.
   */
  async hydrate() {
    // Load MobX store.
    const sync = (await ConnectingStorage.getItem('sync')) as DataSync
    const { revision } = !isEmpty(sync) ? sync : { revision: {} }
    for (const [id, store] of this._persistent) {
      if (id !== 'sync') {
        const data = await ConnectingStorage.getItem(id)
        if (typeof data === 'object' && !isEmpty(data)) {
          store.hydrate(data, revision[id] ?? +new Date())
        }
      }
    }

    await this.save()
  }
}

let state: State

export async function hydrateState() {
  state = new State()
  ;(window as any).state = state
  await state.hydrate()
}

export function useApplicationState() {
  return state
}
