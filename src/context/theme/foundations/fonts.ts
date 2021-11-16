import type { Fonts, MonospaceFonts, FontValue } from './types'

export const FONTS: Record<Fonts, FontValue> = {
  'Open Sans': {
    name: 'Open Sans',
    load: async () => {
      await import('@fontsource/open-sans/300.css')
      await import('@fontsource/open-sans/400.css')
      await import('@fontsource/open-sans/600.css')
      await import('@fontsource/open-sans/700.css')
      await import('@fontsource/open-sans/400-italic.css')
    },
  },
  Inter: {
    name: 'Inter',
    load: async () => {
      await import('@fontsource/inter/300.css')
      await import('@fontsource/inter/400.css')
      await import('@fontsource/inter/600.css')
      await import('@fontsource/inter/700.css')
    },
  },
  'Atkinson Hyperlegible': {
    name: 'Atkinson Hyperlegible',
    load: async () => {
      await import('@fontsource/atkinson-hyperlegible/400.css')
      await import('@fontsource/atkinson-hyperlegible/700.css')
      await import('@fontsource/atkinson-hyperlegible/400-italic.css')
    },
  },
  Roboto: {
    name: 'Roboto',
    load: async () => {
      await import('@fontsource/roboto/400.css')
      await import('@fontsource/roboto/700.css')
      await import('@fontsource/roboto/400-italic.css')
    },
  },
  'Noto Sans': {
    name: 'Noto Sans',
    load: async () => {
      await import('@fontsource/noto-sans/400.css')
      await import('@fontsource/noto-sans/700.css')
      await import('@fontsource/noto-sans/400-italic.css')
    },
  },
  'Bree Serif': {
    name: 'Bree Serif',
    load: () => import('@fontsource/bree-serif/400.css'),
  },
  Lato: {
    name: 'Lato',
    load: async () => {
      await import('@fontsource/lato/300.css')
      await import('@fontsource/lato/400.css')
      await import('@fontsource/lato/700.css')
      await import('@fontsource/lato/400-italic.css')
    },
  },
  Montserrat: {
    name: 'Montserrat',
    load: async () => {
      await import('@fontsource/montserrat/300.css')
      await import('@fontsource/montserrat/400.css')
      await import('@fontsource/montserrat/600.css')
      await import('@fontsource/montserrat/700.css')
      await import('@fontsource/montserrat/400-italic.css')
    },
  },
  Poppins: {
    name: 'Poppins',
    load: async () => {
      await import('@fontsource/poppins/300.css')
      await import('@fontsource/poppins/400.css')
      await import('@fontsource/poppins/600.css')
      await import('@fontsource/poppins/700.css')
      await import('@fontsource/poppins/400-italic.css')
    },
  },
  Raleway: {
    name: 'Raleway',
    load: async () => {
      await import('@fontsource/raleway/300.css')
      await import('@fontsource/raleway/400.css')
      await import('@fontsource/raleway/600.css')
      await import('@fontsource/raleway/700.css')
      await import('@fontsource/raleway/400-italic.css')
    },
  },
  Ubuntu: {
    name: 'Ubuntu',
    load: async () => {
      await import('@fontsource/ubuntu/300.css')
      await import('@fontsource/ubuntu/400.css')
      await import('@fontsource/ubuntu/500.css')
      await import('@fontsource/ubuntu/700.css')
      await import('@fontsource/ubuntu/400-italic.css')
    },
  },
  'Comic Neue': {
    name: 'Comic Neue',
    load: async () => {
      await import('@fontsource/comic-neue/300.css')
      await import('@fontsource/comic-neue/400.css')
      await import('@fontsource/comic-neue/700.css')
      await import('@fontsource/comic-neue/400-italic.css')
    },
  },
}

export const MONOSPACE_FONTS: Record<MonospaceFonts, FontValue> = {
  'Fira Code': {
    name: 'Fira Code',
    load: () => import('@fontsource/fira-code/400.css'),
  },
  'Roboto Mono': {
    name: 'Roboto Mono',
    load: () => import('@fontsource/roboto-mono/400.css'),
  },
  'Source Code Pro': {
    name: 'Source Code Pro',
    load: () => import('@fontsource/source-code-pro/400.css'),
  },
  'Space Mono': {
    name: 'Space Mono',
    load: () => import('@fontsource/space-mono/400.css'),
  },
  'Ubuntu Mono': {
    name: 'Ubuntu Mono',
    load: () => import('@fontsource/ubuntu-mono/400.css'),
  },
  'JetBrains Mono': {
    name: 'JetBrains Mono',
    load: () => import('@fontsource/jetbrains-mono/400.css'),
  },
}

export const FONT_KEYS = Object.keys(FONTS).sort()
export const MONOSPACE_FONT_KEYS = Object.keys(MONOSPACE_FONTS).sort()

export const DEFAULT_FONT = 'Open Sans'
export const DEFAULT_MONO_FONT = 'Fira Code'
