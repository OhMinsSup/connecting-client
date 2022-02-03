export type SyncKeys = 'theme' | 'appearance' | 'locale' | 'notifications'

export interface DataSync {
  disabled: SyncKeys[]
  revision: {
    [key: string]: number
  }
}
