export type Variables =
  | 'accent'
  | 'background'
  | 'foreground'
  | 'block'
  | 'message-box'
  | 'mention'
  | 'success'
  | 'warning'
  | 'error'
  | 'hover'
  | 'scrollbar-thumb'
  | 'scrollbar-track'
  | 'primary-background'
  | 'primary-header'
  | 'secondary-background'
  | 'secondary-foreground'
  | 'secondary-header'
  | 'tertiary-background'
  | 'tertiary-foreground'
  | 'tooltip'
  | 'status-online'
  | 'status-away'
  | 'status-busy'
  | 'status-streaming'
  | 'status-invisible'

// While this isn't used, it'd be good to keep this up to date as a reference or for future use
export type HiddenVariables = 'font' | 'ligatures' | 'app-height' | 'sidebar-active' | 'monospace-font'

export type Fonts =
  | 'Open Sans'
  | 'Inter'
  | 'Atkinson Hyperlegible'
  | 'Roboto'
  | 'Noto Sans'
  | 'Lato'
  | 'Bitter'
  | 'Montserrat'
  | 'Poppins'
  | 'Raleway'
  | 'Ubuntu'
  | 'Comic Neue'
  | 'Lexend'

export type MonospaceFonts = 'Fira Code' | 'Roboto Mono' | 'Source Code Pro' | 'Space Mono' | 'Ubuntu Mono' | 'JetBrains Mono'
export type FontValue = { name: string; load: () => void }

export type Overrides = {
  [variable in Variables]: string
}

export type Theme = Overrides & {
  light?: boolean
  font?: Fonts
  css?: string
  monospaceFont?: MonospaceFonts
  'min-opacity'?: number
}

export interface ThemeOptions {
  base?: string
  ligatures?: boolean
  custom?: Partial<Theme>
}

export type ComputedVariables = Theme & {
  'header-height'?: string
  'effective-bottom-offset'?: string
}
