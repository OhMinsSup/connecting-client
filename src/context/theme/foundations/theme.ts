import { createGlobalStyle } from 'styled-components'
import { getState } from '../../../store'
import type { Theme, Variables } from './types'

export const PRESETS: Record<string, Theme> = {
  light: {
    light: true,
    accent: '#FD6671',
    background: '#F6F6F6',
    foreground: '#000000',
    block: '#414141',
    'message-box': '#F1F1F1',
    mention: 'rgba(251, 255, 0, 0.40)',
    success: '#65E572',
    warning: '#FAA352',
    error: '#ED4245',
    hover: 'rgba(0, 0, 0, 0.2)',
    'scrollbar-thumb': '#CA525A',
    'scrollbar-track': 'transparent',
    'primary-background': '#FFFFFF',
    'primary-header': '#F1F1F1',
    'secondary-background': '#F1F1F1',
    'secondary-foreground': '#1f1f1f',
    'secondary-header': '#F1F1F1',
    'tertiary-background': '#4D4D4D',
    'tertiary-foreground': '#3a3a3a',
    'status-online': '#3ABF7E',
    'status-away': '#F39F00',
    'status-busy': '#F84848',
    'status-streaming': '#977EFF',
    'status-invisible': '#A5A5A5',
  },
  dark: {
    light: false,
    accent: '#FD6671',
    background: '#191919',
    foreground: '#F6F6F6',
    block: '#2D2D2D',
    'message-box': '#363636',
    mention: 'rgba(251, 255, 0, 0.06)',
    success: '#65E572',
    warning: '#FAA352',
    error: '#ED4245',
    hover: 'rgba(0, 0, 0, 0.1)',
    'scrollbar-thumb': '#CA525A',
    'scrollbar-track': 'transparent',
    'primary-background': '#242424',
    'primary-header': '#363636',
    'secondary-background': '#1E1E1E',
    'secondary-foreground': '#C8C8C8',
    'secondary-header': '#2D2D2D',
    'tertiary-background': '#4D4D4D',
    'tertiary-foreground': '#848484',
    'status-online': '#3ABF7E',
    'status-away': '#F39F00',
    'status-busy': '#F84848',
    'status-streaming': '#977EFF',
    'status-invisible': '#A5A5A5',
  },
}

const keys = Object.keys(PRESETS.dark)

// todo: store used themes locally
export function getBaseTheme(name: string): Theme {
  if (name in PRESETS) {
    return PRESETS[name]
  }
  // TODO: properly initialize `themes` in state instead of letting it be undefined
  const themes = getState().themes ?? {}
  if (name in themes) {
    const { theme } = themes[name]
    return {
      ...PRESETS[theme.light ? 'light' : 'dark'],
      ...theme,
    }
  }
  // how did we get here
  return PRESETS['dark']
}

export const generateVariables = (theme: Theme) => {
  return (Object.keys(theme) as Variables[]).map((key) => {
    if (!keys.includes(key)) return
    return `--${key}: ${theme[key]};`
  })
}

export const GlobalTheme = createGlobalStyle<{ theme: Theme }>`
:root {
	${(props) => generateVariables(props.theme)}
}
`
