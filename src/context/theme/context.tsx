import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useApplicationState } from '../../libs/state'
import { DEFAULT_FONT, DEFAULT_MONO_FONT, FONTS, MONOSPACE_FONTS } from './foundations/fonts'
import { GlobalTheme } from './foundations/theme'

function ThemeProvider() {
  const [state, setState] = useState<ReturnType<typeof useApplicationState> | undefined>(undefined)
  const settings = state?.settings
  const theme = settings?.theme

  // document element값이 변경되는 경우는 없으니깐, memo 적용
  const rootStyle = useMemo(() => document.documentElement.style, [])

  useEffect(() => {
    const font = theme?.getFont() ?? DEFAULT_FONT
    rootStyle.setProperty('--font', `"${font}"`)
    // @ts-ignore
    FONTS[font].load()
  }, [rootStyle, theme?.getFont()])

  useEffect(() => {
    const font = theme?.getMonospaceFont() ?? DEFAULT_MONO_FONT
    rootStyle.setProperty('--monospace-font', `"${font}"`)
    // @ts-ignore
    MONOSPACE_FONTS[font].load()
  }, [rootStyle, theme?.getMonospaceFont()])

  useEffect(() => {
    rootStyle.setProperty('--ligatures', settings?.get('appearance:ligatures') ? 'normal' : 'none')
  }, [rootStyle, settings?.get('appearance:ligatures')])

  useEffect(() => {
    const resize = () => rootStyle.setProperty('--app-height', `${window.innerHeight}px`)
    resize()

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [rootStyle])

  useEffect(() => {
    const state = useApplicationState()
    if (state) {
      setState(state)
    }
  }, [])

  const variables = theme?.computeVariables()

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={variables?.['background']} />
      </Helmet>
      {variables && <GlobalTheme theme={variables} />}
      <style dangerouslySetInnerHTML={{ __html: theme?.getCSS() ?? '' }} />
    </>
  )
}

export { ThemeProvider }
