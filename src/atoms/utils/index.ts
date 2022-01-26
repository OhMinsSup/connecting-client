import rgba from 'color-rgba'
import { createGlobalStyle } from 'styled-components'
import type { Theme, Variables } from '../type/setting'

export function getContrastingColour(hex: string, fallback?: string): string {
  if (typeof hex !== 'string') return 'black'

  const colour = rgba(hex)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  if (!colour) return fallback ? getContrastingColour(fallback) : 'black'

  // https://awik.io/determine-color-bright-dark-using-javascript/
  // http://alienryderflex.com/hsp.html
  const [r, g, b] = colour
  // const hsp = Math.sqrt(0.299 * r ** 2 + 0.587 * g ** 2 + 0.114 * b ** 2);
  // Using Skia numbers.
  const hsp = Math.sqrt(0.2126 * r ** 2 + 0.7152 * g ** 2 + 0.0722 * b ** 2)
  return hsp > 175 ? 'black' : 'white'
}

export const generateVariables = (theme: Theme) => {
  return (Object.keys(theme) as Variables[]).map((key) => {
    const colour = rgba(theme[key])
    if (colour) {
      const [r, g, b] = colour
      return `--${key}: ${theme[key]}; --${key}-rgb: ${r}, ${g}, ${b};`
    } else {
      return `--${key}: ${theme[key]};`
    }
  })
}

export const GlobalTheme = createGlobalStyle<{ theme: Theme }>`
:root {
	${(props) => generateVariables(props.theme)}
}
`
