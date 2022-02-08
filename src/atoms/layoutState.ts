import { atom, useRecoilState, useResetRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

export interface LayoutState {
  /**
   * 사용자가 마지막으로 연 '주요 섹션'입니다.
   * 홈 탭 또는 채널 ID(서버 채널의 경우)입니다.
   */
  lastSection: 'home' | string

  /**
   * 사용자가 홈 탭에서 마지막으로 연 경로입니다.
   */
  lastHomePath: string

  /**
   * 서버에서 본 마지막 채널의 맵입니다.
   */
  lastOpened: Map<string, string>

  /**
   * 현재 상태에 대한 섹션 ID의 맵입니다.
   */
  openSections: Map<string, boolean>
}

export const layoutState = atom<LayoutState>({
  key: 'layoutState',
  default: {
    lastSection: 'home',
    lastHomePath: '/',
    lastOpened: new Map(),
    openSections: new Map(),
  },
})

// useLayoutState 상태값 변경 및 가져오는 함수
export function useLayoutState() {
  return useRecoilState(layoutState)
}

// useLayoutResetState 상태값 초기화 함수
export function useLayoutResetState() {
  return useResetRecoilState(layoutState)
}

// SetState 상태값 변경 함수
export function useLayoutSetState() {
  return useSetRecoilState(layoutState)
}

export function useLayoutValue() {
  return useRecoilValue(layoutState)
}

export function useLayoutActionHook() {
  return {}
}
