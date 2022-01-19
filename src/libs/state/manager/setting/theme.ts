import rgba from 'color-rgba'
import { isTouchscreenDevice } from '../../../utils/utils'
import { PRESETS } from '../../../../context/theme/foundations/theme'
import { DEFAULT_FONT, DEFAULT_MONO_FONT } from '../../../../context/theme/foundations/fonts'

import type { Setting } from '.'
import type { ComputedVariables, Fonts, MonospaceFonts, Variables } from '../../../../context/theme/foundations/types'

export class Theme {
  private _settings: Setting

  constructor(settings: Setting) {
    this._settings = settings

    this.setBase = this.setBase.bind(this)
    this.reset = this.reset.bind(this)
  }

  toJSON() {
    return JSON.parse(
      JSON.stringify({
        ...this.getVariables(),
        css: this.getCSS(),
        font: this.getFont(),
        monospaceFont: this.getMonospaceFont(),
      }),
    )
  }

  hydrate(data: Partial<Theme>, resetCSS = false) {
    if (resetCSS) this.setCSS()

    for (const key of Object.keys(data)) {
      const value = data[key as keyof Theme] as any
      switch (key) {
        case 'css': {
          this.setCSS(value)
          break
        }
        case 'font': {
          this.setFont(value as Fonts)
          break
        }
        case 'monospaceFont': {
          this.setMonospaceFont(value as MonospaceFonts)
          break
        }
        default:
          this.setVariable(key as Variables, value)
      }
    }
  }

  computeVariables(): ComputedVariables {
    const variables = this.getVariables() as any

    for (const key of Object.keys(variables)) {
      const value = variables[key]
      if (typeof value === 'string') {
        variables[key + '-contrast'] = getContrastingColour(value)
      }
    }

    return {
      ...(variables as unknown as Theme),
      'min-opacity': this._settings.get('appearance:transparency', true) ? 0 : 1,
      'header-height': isTouchscreenDevice ? '56px' : '48px',
      'effective-bottom-offset': isTouchscreenDevice ? 'var(--bottom-navigation-height)' : '0px',
    } as ComputedVariables
  }

  getBase() {
    return this._settings.get('appearance:theme:base') ?? 'dark'
  }

  getCSS() {
    return this._settings.get('appearance:theme:css')
  }

  getMonospaceFont() {
    return this._settings.get('appearance:theme:monoFont') ?? DEFAULT_MONO_FONT
  }

  getFont() {
    return this._settings.get('appearance:theme:font') ?? DEFAULT_FONT
  }

  getVariable(key: Variables) {
    const base = PRESETS[this.getBase()]
    return (this._settings.get('appearance:theme:overrides')?.[key] ?? base?.[key])!
  }

  getVariables(): Theme {
    return {
      ...PRESETS[this.getBase()],
      ...this._settings.get('appearance:theme:overrides'),
      light: this.isLight(),
    }
  }

  getContrastingVariable(key: Variables, fallback?: string) {
    return getContrastingColour(this.getVariable(key), fallback)
  }

  isLight() {
    return this._settings.get('appearance:theme:light') ?? this.getBase() === 'light'
  }

  isModified() {
    return Object.keys(this._settings.get('appearance:theme:overrides') ?? {}).length > 0
  }

  setVariable(key: Variables, value: string) {
    this._settings.set('appearance:theme:overrides', {
      ...this._settings.get('appearance:theme:overrides'),
      [key]: value,
    })
  }

  setCSS(value?: string) {
    if (value && value.length > 0) {
      this._settings.set('appearance:theme:css', value)
    } else {
      this._settings.remove('appearance:theme:css')
    }
  }

  setBase(color?: 'light' | 'dark') {
    if (color) {
      this._settings.set('appearance:theme:base', color)
    } else {
      this._settings.remove('appearance:theme:base')
    }
  }

  setMonospaceFont(font: MonospaceFonts) {
    this._settings.set('appearance:theme:monoFont', font)
  }

  setFont(font: Fonts) {
    this._settings.set('appearance:theme:font', font)
  }

  reset() {
    this._settings.remove('appearance:theme:overrides')
    this._settings.remove('appearance:theme:css')
  }
}

function getContrastingColour(hex: string, fallback?: string): string {
  if (typeof hex !== 'string') return 'black'

  const colour = rgba(hex)
  if (!colour) return fallback ? getContrastingColour(fallback) : 'black'

  const [r, g, b] = colour
  return (r / 255) * 0.299 + (g / 255) * 0.587 + (b / 255) * 0.114 >= 0.186 ? 'black' : 'white'
}
