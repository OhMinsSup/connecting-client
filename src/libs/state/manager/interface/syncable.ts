import type { StoreInterface } from './store'

// 데이터를 서버와 동기화하는 데이터 저장소입니다.
export interface SyncableInterface extends StoreInterface {
  apply(key: string, data: unknown, revision: number): void
  toSyncable(): { [key: string]: Record<string, any> }
}
