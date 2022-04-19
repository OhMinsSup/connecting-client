import React, { useMemo } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'
import { Helmet } from 'react-helmet-async'

// hooks
import { useThemeActionHook } from '../../../atoms/settingState'

// utils
import { GlobalTheme } from '../../../atoms/utils'

// constants
import { FONTS, MONOSPACE_FONTS } from '../../../atoms/constants/setting'

interface StylesProps {}
const Styles: React.FC<React.PropsWithChildren<StylesProps>> = ({ children }) => {
  const { computeVariables, getFont, getMonospaceFont, getLigatures, getCSS } = useThemeActionHook()

  // document element값이 변경되는 경우는 없으니깐, memo 적용
  const rootStyle = useMemo(() => document.documentElement.style, [])

  useIsomorphicLayoutEffect(() => {
    const font = getFont()
    rootStyle.setProperty('--font', `"${font}"`)
    // @ts-ignore
    FONTS[font].load()
  }, [rootStyle, getFont()])

  useIsomorphicLayoutEffect(() => {
    const font = getMonospaceFont()
    rootStyle.setProperty('--monospace-font', `"${font}"`)
    // @ts-ignore
    MONOSPACE_FONTS[font].load()
  }, [rootStyle, getMonospaceFont()])

  useIsomorphicLayoutEffect(() => {
    rootStyle.setProperty('--ligatures', getLigatures())
  }, [rootStyle, getLigatures()])

  useIsomorphicLayoutEffect(() => {
    const resize = () => rootStyle.setProperty('--app-height', `${window.innerHeight}px`)
    resize()

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [rootStyle])

  const variables = computeVariables()

  return (
    <>
      <Helmet>
        <meta name="theme-color" content={variables?.['background']} />
      </Helmet>
      {variables && <GlobalTheme theme={variables} />}
      <style dangerouslySetInnerHTML={{ __html: getCSS() ?? '' }} />
      {children}
    </>
  )
}

export default Styles
