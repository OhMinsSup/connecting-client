import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { createContext } from '../../libs/react-utils'
import { DEFAULT_FONT, DEFAULT_MONO_FONT, FONTS, MONOSPACE_FONTS } from './foundations/fonts'
import { getBaseTheme, GlobalTheme, PRESETS } from './foundations/theme'
import type { Theme, ThemeOptions } from './foundations/types'

interface ThemeContext extends Theme {}

const [Provider, useThemeContext] = createContext<ThemeContext>({
  name: 'ThemeContext',
  errorMessage: 'useThemeContext: `context` is undefined.',
  defaultValue: PRESETS['dark'],
})

interface ThemeProps {
  children: React.ReactNode
  options?: ThemeOptions
}

function ThemeProvider({ children, options }: ThemeProps) {
  const theme: Theme = {
    ...getBaseTheme(options?.base ?? 'dark'),
    ...options?.custom,
  }

  // document element값이 변경되는 경우는 없으니깐, memo 적용
  const rootStyle = useMemo(() => document.documentElement.style, [])

  // 테마가 변경되면, 테마를 적용하고, 폰트를 적용한다.
  useEffect(() => {
    const font = theme.font ?? DEFAULT_FONT
    rootStyle.setProperty('--font', `"${font}"`)
    FONTS[font].load()
  }, [rootStyle, theme.font])

  // 테마가 변경되면, 테마를 적용하고, 폰트를 적용한다.
  useEffect(() => {
    const font = theme.monospaceFont ?? DEFAULT_MONO_FONT
    console.log('font', font)
    rootStyle.setProperty('--monospace-font', `"${font}"`)
    MONOSPACE_FONTS[font].load()
  }, [rootStyle, theme.monospaceFont])

  // 테마가 변경되면, 테마를 적용한다.
  useEffect(() => {
    rootStyle.setProperty('--ligatures', options?.ligatures ? 'normal' : 'none')
  }, [rootStyle, options?.ligatures])

  // 사이즈를 변경하면 해당 사이즈를 변경한다.
  useEffect(() => {
    const resize = () => rootStyle.setProperty('--app-height', `${window.innerHeight}px`)
    resize()

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [rootStyle])

  return (
    <Provider value={theme}>
      <Helmet>
        <meta name="theme-color" content={theme['background']} />
      </Helmet>
      <GlobalTheme theme={theme} />
      {theme.css && <style dangerouslySetInnerHTML={{ __html: theme.css }} />}
      {children}
    </Provider>
  )
}

export { ThemeProvider, useThemeContext }
