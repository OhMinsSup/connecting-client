import ResizeObserver from 'resize-observer-polyfill'
import { getTargetElement, isBrowser } from '../libs/utils/utils'
import { createEffectWithTarget } from '../libs/react-utils/createEffectWithTarget'
import { useEffect, useLayoutEffect } from 'react'
import useRafState from './useRafState'

import type { BasicTarget } from '../libs/utils/utils'

const useLayoutEffectWithTarget = createEffectWithTarget(useLayoutEffect)
const useEffectWithTarget = createEffectWithTarget(useEffect)

const useIsomorphicLayoutEffectWithTarget = isBrowser ? useLayoutEffectWithTarget : useEffectWithTarget

type Size = { width: number; height: number }

export const useResizeObserver = (target: BasicTarget) => {
  const [state, setState] = useRafState<Size>()

  useIsomorphicLayoutEffectWithTarget(
    () => {
      const el = getTargetElement(target)

      if (!el) {
        return
      }

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { clientWidth, clientHeight } = entry.target
          setState({
            width: clientWidth,
            height: clientHeight,
          })
        })
      })

      resizeObserver.observe(el)
      return () => {
        resizeObserver.disconnect()
      }
    },
    [],
    target,
  )

  return state
}
