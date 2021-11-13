import { Helmet } from 'react-helmet-async'
import { createGlobalStyle } from 'styled-components'

import { createContext } from '../../libs/react-utils'

// const GlobalTheme = createGlobalStyle<{ theme: Theme }>`
// :root {
// 	${(props) => generateVariables(props.theme)}
// }
// `

interface ThemeContext {}

const [ThemeProvider] = createContext<ThemeContext>({
  name: 'ThemeContext',
  errorMessage: 'useThemeContext: `context` is undefined.',
})

interface ThemeProps {
  children: React.ReactNode
  options?: any
}

function Theme({}: ThemeProps) {
  return (
    <ThemeProvider value={{}}>
      <Helmet>{/* <meta name="theme-color" content={theme["background"]} /> */}</Helmet>
    </ThemeProvider>
  )
}
