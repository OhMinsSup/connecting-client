import type { StoreInterface } from './store'

// 영구적이고 데이터를 로컬로 캐시해야 하는 데이터 저장소입니다.
export interface PersistentInterface<T> extends StoreInterface {
  // 이 데이터 저장소를 직렬화
  toJSON(): unknown

  /**
   * 주어진 데이터를 사용하여 이 데이터 저장소를 수화.
   * @param data 주어진 데이터
   * */
  hydrate(data: T, version: number): void
}
