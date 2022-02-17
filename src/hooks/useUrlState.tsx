import { useState, useCallback, useMemo, useRef } from 'react'
import { stringify, parse } from 'qs'
import type { IStringifyOptions, IParseOptions } from 'qs'
import * as tmp from 'react-router'

const useUpdate = () => {
  const [, setState] = useState({})

  return useCallback(() => setState({}), [])
}

// ignore waring `"export 'useNavigate' (imported as 'rc') was not found in 'react-router'`
const rc = tmp as any

export interface Options {
  navigateMode?: 'push' | 'replace'
  parseOptions?: IParseOptions
  stringifyOptions?: IStringifyOptions
}

const baseParseConfig: IParseOptions = {}

const baseStringifyConfig: IStringifyOptions = {
  skipNulls: true,
  addQueryPrefix: true,
}

type UrlState = Record<string, any>

const useUrlState = <S extends UrlState = UrlState>(initialState?: S | (() => S), options?: Options) => {
  type State = Partial<{ [key in keyof S]: any }>
  const { navigateMode = 'push', parseOptions, stringifyOptions } = options || {}

  const mergedParseOptions = { ...baseParseConfig, ...parseOptions }
  const mergedStringifyOptions = { ...baseStringifyConfig, ...stringifyOptions }

  const location = rc.useLocation()

  // react-router v6
  const navigate = rc.useNavigate()

  const update = useUpdate()

  const initialStateRef = useRef(typeof initialState === 'function' ? (initialState as () => S)() : initialState || {})

  const queryFromUrl = useMemo(() => {
    return parse(location.search, mergedParseOptions)
  }, [location.search])

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...queryFromUrl,
    }),
    [queryFromUrl],
  )

  const setState = useCallback(
    (s: React.SetStateAction<State>) => {
      const newQuery = typeof s === 'function' ? s(targetQuery) : s

      update()

      navigate(
        {
          hash: location.hash,
          search: stringify({ ...queryFromUrl, ...newQuery }, mergedStringifyOptions) || '',
        },
        {
          replace: navigateMode === 'replace',
        },
      )
    },
    [location, navigateMode, targetQuery, mergedStringifyOptions, queryFromUrl],
  )

  return [targetQuery, setState] as const
}

export default useUrlState
