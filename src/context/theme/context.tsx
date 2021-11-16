import { Helmet } from 'react-helmet-async'
import { createContext } from '../../libs/react-utils'
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

  return (
    <Provider value={theme}>
      <Helmet>
        <meta name="theme-color" content={theme['background']} />
      </Helmet>
      <GlobalTheme theme={theme} />
      {children}
    </Provider>
  )
}

export { ThemeProvider, useThemeContext }
