import produce from 'immer'
import { atom, useRecoilState, useResetRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { DEFAULT_FONT, DEFAULT_MONO_FONT, PRESETS } from './constants/setting'
import { getContrastingColour } from './utils'
import type { Fonts, MonospaceFonts, Theme, Overrides, Variables, ComputedVariables } from './type/setting'
import { isTouchscreenDevice } from '../libs/utils/utils'

export interface SettingState {
  'notifications:desktop'?: boolean
  'notifications:sounds'?: any // SoundOptions

  'appearance:emoji'?: any
  'appearance:seasonal'?: boolean
  'appearance:ligatures'?: boolean
  'appearance:transparency'?: boolean

  // theme
  'appearance:theme:base'?: 'dark' | 'light'
  'appearance:theme:overrides'?: Partial<Overrides>
  'appearance:theme:light': Theme['light']
  'appearance:theme:font': Theme['font']
  'appearance:theme:monospaceFont': Theme['monospaceFont']
  'appearance:theme:css': Theme['css']
  'appearance:theme:min-opacity': Theme['min-opacity']

  'security:trustedOrigins'?: string[]
}

export const settingState = atom<SettingState>({
  key: 'settingState',
  default: {
    'notifications:desktop': undefined,
    'notifications:sounds': undefined,

    'appearance:emoji': undefined,
    'appearance:seasonal': undefined,
    'appearance:ligatures': undefined,
    'appearance:transparency': undefined,
    // theme
    'appearance:theme:base': 'dark',
    'appearance:theme:overrides': undefined,
    'appearance:theme:light': false,
    'appearance:theme:font': DEFAULT_FONT,
    'appearance:theme:monospaceFont': DEFAULT_MONO_FONT,
    'appearance:theme:css': undefined,
    'appearance:theme:min-opacity': undefined,

    'security:trustedOrigins': undefined,
  },
})

// useSettingState 상태값 변경 및 가져오는 함수
export function useSettingState() {
  return useRecoilState(settingState)
}

// useSettingResetState 상태값 초기화 함수
export function useSettingResetState() {
  return useResetRecoilState(settingState)
}

// useSettingSetState 상태값 변경 함수
export function useSettingSetState() {
  return useSetRecoilState(settingState)
}

export function useSettingValue() {
  return useRecoilValue(settingState)
}

export function useThemeActionHook() {
  const [state, setState] = useSettingState()

  const getBase = () => {
    return state['appearance:theme:base'] ?? 'dark'
  }

  const isLight = () => {
    return state['appearance:theme:light'] ?? getBase() === 'light'
  }

  const isModified = () => {
    return Object.keys(state['appearance:theme:overrides'] ?? {}).length > 0
  }

  const getVariables = (): Theme => {
    return {
      ...PRESETS[getBase()],
      ...(state['appearance:theme:overrides'] ?? {}),
      light: isLight(),
    }
  }

  const getVariable = (key: Variables) => {
    return state['appearance:theme:overrides']?.[key] ?? PRESETS[getBase()]?.[key]
  }

  const getContrastingVariable = (key: Variables, fallback?: string) => {
    return getContrastingColour(getVariable(key), fallback)
  }

  const getFont = () => {
    return state['appearance:theme:font'] ?? DEFAULT_FONT
  }

  const getMonospaceFont = () => {
    return state['appearance:theme:monospaceFont'] ?? DEFAULT_MONO_FONT
  }

  const getCSS = () => {
    return state['appearance:theme:css']
  }

  const getLigatures = () => {
    return state['appearance:ligatures'] ? 'normal' : 'none'
  }

  const hydrate = (data: Partial<Theme>, resetCSS = false) => {
    if (resetCSS) setCSS()

    for (const key of Object.keys(data)) {
      const safeKey = key as keyof Theme
      const value = data[safeKey] as string

      switch (safeKey) {
        case 'css':
          setCSS(value)
          break
        case 'font':
          setFont(value as Fonts)
          break
        case 'monospaceFont':
          setMonospaceFont(value as MonospaceFonts)
          break
        default:
          setVariable(key as Variables, value)
      }
    }
  }

  const setBase = (base?: 'light' | 'dark') => {
    if (base) {
      setState((prevState) => ({
        ...prevState,
        'appearance:theme:base': base,
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        'appearance:theme:base': undefined,
      }))
    }
  }

  const setCSS = (value?: string) => {
    if (value) {
      setState((prevState) => ({
        ...prevState,
        'appearance:theme:css': value,
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        'appearance:theme:css': undefined,
      }))
    }
  }

  const setFont = (font?: Fonts) => {
    setState((prevState) => ({
      ...prevState,
      'appearance:theme:font': font,
    }))
  }

  const setMonospaceFont = (font: MonospaceFonts) => {
    setState((prevState) => ({
      ...prevState,
      'appearance:theme:monoFont': font,
    }))
  }

  const setVariable = (key: Variables, value: string) => {
    setState(
      produce((draft) => {
        if (draft['appearance:theme:overrides']) {
          draft['appearance:theme:overrides'][key] = value
        } else {
          draft['appearance:theme:overrides'] = {
            [key]: value,
          }
        }
      }),
    )
  }

  const resetOverrideWithCSS = () => {
    setState((prevState) => ({
      ...prevState,
      'appearance:theme:overrides': undefined,
      'appearance:theme:css': undefined,
    }))
  }

  const computeVariables = (): ComputedVariables => {
    const variables = getVariables() as Record<string, string | boolean | number>

    for (const key of Object.keys(variables)) {
      const value = variables[key]
      if (typeof value === 'string') {
        variables[key + '-contrast'] = getContrastingColour(value)
      }
    }

    return {
      ...(variables as unknown as Theme),
      'min-opacity': state['appearance:transparency'] ?? true ? 0 : 1,
      'header-height': isTouchscreenDevice ? '56px' : '48px',
      'effective-bottom-offset': isTouchscreenDevice ? 'var(--bottom-navigation-height)' : '0px',
    }
  }

  return {
    setBase,
    setFont,
    setCSS,
    setMonospaceFont,
    setVariable,
    resetOverrideWithCSS,
    computeVariables,
    hydrate,
    getBase,
    isLight,
    isModified,
    getVariables,
    getVariable,
    getContrastingVariable,
    getFont,
    getMonospaceFont,
    getCSS,
    getLigatures,
  }
}
