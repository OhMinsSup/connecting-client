import React, { useEffect, useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { isTouchscreenDevice } from '../../../libs/utils/utils'

import TextArea from './TextArea'

import type { TextAreaProps } from './TextArea'

type TextAreaAutoSizeProps = Omit<React.HTMLAttributes<HTMLTextAreaElement>, 'style' | 'value' | 'onChange' | 'children' | 'as'> &
  TextAreaProps & {
    forceFocus?: boolean
    autoFocus?: boolean
    minHeight?: number
    maxRows?: number
    value: string

    id?: string

    onChange?: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void
  }

function TextAreaAutoSize(props: TextAreaAutoSizeProps) {
  const { autoFocus, minHeight, maxRows, value, padding, lineHeight, hideBorder, forceFocus, onChange, ...textAreaProps } = props

  const ref = useRef<HTMLTextAreaElement | null>(null)
  const ghost = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (ref.current && ghost.current) {
      ref.current.style.height = `${ghost.current.clientHeight}px`
    }
  }, [ghost, props.value])

  useEffect(() => {
    if (isTouchscreenDevice) return
    autoFocus && ref.current && ref.current.focus()
  }, [value, autoFocus])

  const inputSelected = () => ['TEXTAREA', 'INPUT'].includes(document.activeElement?.nodeName ?? '')

  useEffect(() => {
    if (!ref.current) return
    if (forceFocus) {
      ref.current.focus()
    }

    if (isTouchscreenDevice) return
    if (autoFocus && !inputSelected()) {
      ref.current.focus()
    }

    if (!autoFocus) return
    function keyDown(e: KeyboardEvent) {
      if ((e.ctrlKey && e.key !== 'v') || e.altKey || e.metaKey) return
      if (e.key.length !== 1) return
      if (ref && !inputSelected()) {
        ref.current!.focus()
      }
    }

    document.body.addEventListener('keydown', keyDown)
    return () => document.body.removeEventListener('keydown', keyDown)
  }, [ref, autoFocus, forceFocus, value])

  useEffect(() => {
    if (!ref.current) return
    // function focus(id: string) {
    //   if (id === props.id) {
    //     ref.current!.focus()
    //   }
    // }

    // return internalSubscribe('TextArea', 'focus', focus as (...args: unknown[]) => void)
  }, [props.id, ref])

  return (
    <Block>
      <TextArea
        ref={ref}
        value={value}
        padding={padding}
        style={{ minHeight }}
        hideBorder={hideBorder}
        lineHeight={lineHeight}
        onChange={onChange}
        {...textAreaProps}
      />
      <Ghost lineHeight={lineHeight ?? 'var(--textarea-line-height)'} maxRows={maxRows ?? 5}>
        <div ref={ghost} style={{ padding }}>
          {props.value
            ? props.value
                .split('\n')
                .map((x) => `\u200e${x}`)
                .join('\n')
            : undefined ?? '\n'}
        </div>
      </Ghost>
    </Block>
  )
}

export default TextAreaAutoSize

const Block = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const Ghost = styled.div<{ lineHeight: string; maxRows: number }>`
  flex: 0;
  width: 100%;
  overflow: hidden;
  visibility: hidden;
  position: relative;

  > div {
    width: 100%;
    white-space: pre-wrap;
    word-break: break-all;

    top: 0;
    position: absolute;
    font-size: var(--text-size);
    line-height: ${(props) => props.lineHeight};

    max-height: calc(calc(${(props) => props.lineHeight} * ${(props) => props.maxRows}));
  }
`
