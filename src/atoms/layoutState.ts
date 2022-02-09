import produce from 'immer'
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
  lastOpened: Record<string, string>

  /**
   * 현재 상태에 대한 섹션 ID의 맵입니다.
   */
  openSections: Record<string, boolean>
}

export const SIDEBAR_MEMBERS = 'sidebar_members'
export const SIDEBAR_CHANNELS = 'sidebar_channels'
export const SECTION_MENTION = 'mention'
export const SECTION_NSFW = 'nsfw'

export const layoutState = atom<LayoutState>({
  key: 'layoutState',
  default: {
    lastSection: 'home',
    lastHomePath: '/',
    lastOpened: {},
    openSections: {},
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
  const [state, setState] = useLayoutState()

  const hydrate = (data: Partial<LayoutState>) => {
    const state: any = {}

    if (data.lastSection) {
      state.lastSection = data.lastSection
    }

    if (data.lastHomePath) {
      state.lastHomePath = data.lastHomePath
    }

    if (data.lastOpened) {
      Object.keys(data.lastOpened).forEach((key) => {
        if (data.lastOpened?.[key]) {
          state.lastOpened[key] = data.lastOpened[key]
        }
      })
    }

    if (data.openSections) {
      Object.keys(data.openSections).forEach((key) => {
        if (data.openSections?.[key]) {
          state.openSections[key] = data.openSections[key]
        }
      })
    }

    setState(state)
  }

  /**
   * Get the last path the user had open in the home tab.
   * @returns Last home path
   */
  const getLastHomePath = () => {
    return state.lastHomePath
  }

  /**
   * Get last opened channel in a server.
   * @param server Server ID
   */
  const getLastOpened = (server: string) => {
    return state.lastOpened[server]
  }

  /**
   * Get the path to a server (as seen on sidebar).
   * @param server Server ID
   * @returns Pathname
   */
  const getServerPath = (server: string) => {
    let path = `/server/${server}`
    if (state.lastOpened[server]) {
      path += `/channel/${getLastOpened(server)}`
    }

    return path
  }

  /**
   * Get the last path the user had open.
   * @returns Last path
   */
  const getLastPath = () => {
    const { lastHomePath, lastSection } = state
    return lastSection === 'home' ? lastHomePath : getServerPath(lastSection) ?? lastHomePath ?? '/'
  }

  /**
   *
   * @param id Section ID
   * @returns Whether the section is open
   * @param def Default state value
   */
  const getSectionState = (id: string, def?: boolean) => {
    return state.openSections[id] ?? def ?? false
  }

  /**
   * Set last opened channel in a server.
   * @param server Server ID
   * @param channel Channel ID
   */
  const setLastOpened = (server: string, channel: string) => {
    setState(
      produce(state, (draft) => {
        draft.lastOpened[server] = channel
        draft.lastSection = server
      }),
    )
  }

  /**
   * Set the last opened section.
   * @param section Section name
   */
  const setLastSection = (section: string) => {
    setState((state) => {
      return produce(state, (draft) => {
        draft.lastSection = section
      })
    })
  }

  /**
   * Set the current path open in the home tab.
   * @param path Pathname
   */
  const setLastHomePath = (path: string) => {
    if (path.startsWith('/bot')) return
    if (path.startsWith('/invite')) return

    setState(
      produce((draft) => {
        draft.lastHomePath = path
        draft.lastSection = 'home'
      }),
    )
  }

  /**
   * Set the state of a section.
   * @param id Section ID
   * @param value New state value
   * @param def Default state value
   */
  const setSectionState = (id: string, value: boolean, def?: boolean) => {
    if (value === def) {
      setState((state) => {
        const newOpenSections: Record<string, boolean> = {}
        for (const key in state.openSections) {
          if (key !== id) {
            newOpenSections[key] = state.openSections[key]
          }
        }
        return { ...state, openSections: newOpenSections }
      })
    } else {
      setState((state) => {
        return produce(state, (draft) => {
          draft.openSections[id] = value
        })
      })
    }
  }

  /**
   * Toggle state of a section.
   * @param id Section ID
   * @param def Default state value
   */
  const toggleSectionState = (id: string, def?: boolean) => {
    setSectionState(id, !getSectionState(id, def), def)
  }

  return {
    getLastHomePath,
    getLastOpened,
    getServerPath,
    getLastPath,
    getSectionState,
    // set
    setLastOpened,
    setLastSection,
    setLastHomePath,
    setSectionState,
    toggleSectionState,
    // hydrate
    hydrate,
  }
}
