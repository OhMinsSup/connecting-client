import qs from 'qs'
import { isDesktop, isMobile, isTablet } from 'react-device-detect'

export const isTouchscreenDevice = isDesktop || isTablet ? false : (typeof window !== 'undefined' ? navigator.maxTouchPoints > 0 : false) || isMobile

export const makeQueryString = (params: any) => {
  const stringify = qs.stringify(params, {
    arrayFormat: 'comma',
    skipNulls: true,
    addQueryPrefix: true,
  })
  return stringify
}
