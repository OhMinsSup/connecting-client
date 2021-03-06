import React, { useCallback, useState, useEffect, useRef } from 'react'
import styled, { css, keyframes } from 'styled-components'

// components
import Button from '../Form/Button'
import { Portal } from '../../../context/portal/context'

// hooks
import { useOutsideClick } from '../../../hooks/useOutsideClick'

// types
import type { ButtonProps } from '../Form/Button'

interface ModalAction extends Omit<ButtonProps, 'onClick'> {
  onClick: (...args: any[]) => void
  confirmation?: boolean
}

interface ModalProps {
  visible: boolean
  onClose?: () => void
  title?: React.ReactNode
  disallowClosing?: boolean
  noBackground?: boolean
  dontModal?: boolean
  padding?: boolean
  actions?: ModalAction[]
  disabled?: boolean
  border?: boolean
}

export let isModalClosing = false

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = (props) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [animateClose, setAnimateClose] = useState(false)
  isModalClosing = animateClose

  const onClose = useCallback(() => {
    setAnimateClose(true)
    setTimeout(() => onClose?.(), 2e2)
  }, [setAnimateClose, props])

  const confirmationAction = props.actions?.find((action) => action.confirmation)

  useOutsideClick({
    enabled: props.visible,
    ref,
    handler: props?.onClose,
  })

  useEffect(() => {
    if (props.disallowClosing) return

    function keyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        console.log('keydown')
        onClose()
      }
    }

    document.body.addEventListener('keydown', keyDown)
    return () => document.body.removeEventListener('keydown', keyDown)
  }, [props.disallowClosing, onClose])

  useEffect(() => {
    if (!confirmationAction) return

    // ! TODO: this may be done better if we
    // ! can focus the button although that
    // ! doesn't seem to work...
    function keyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        console.log('keydown')
        confirmationAction?.onClick()
      }
    }

    document.body.addEventListener('keydown', keyDown)
    return () => document.body.removeEventListener('keydown', keyDown)
  }, [confirmationAction])

  if (!props.visible) return null

  const content = (
    <ModalContent attachment={!!props.actions} noBackground={props.noBackground} border={props.border} padding={props.padding ?? !props.dontModal}>
      {props.title && <h3>{props.title}</h3>}
      {props.children}
    </ModalContent>
  )

  if (props.dontModal) {
    return content
  }

  return (
    <Portal>
      <ModalBase className={animateClose ? 'closing' : undefined} onClick={(!props.disallowClosing && props.onClose) || undefined}>
        <ModalContainer ref={ref} onClick={(e) => (e.nativeEvent.cancelBubble = true)}>
          {content}
          {props.actions && (
            <ModalActions>
              {props.actions.map((x, index) => (
                <Button key={index} {...x} disabled={props.disabled} />
              ))}
            </ModalActions>
          )}
        </ModalContainer>
      </ModalBase>
    </Portal>
  )
}

export default Modal

const open = keyframes`
    0% {opacity: 0;}
    70% {opacity: 0;}
    100% {opacity: 1;}
`

const close = keyframes`
    0% {opacity: 1;}
    70% {opacity: 0;}
    100% {opacity: 0;}
`

const zoomIn = keyframes`
    0% {transform: scale(0.5);}
    98% {transform: scale(1.01);}
    100% {transform: scale(1);}
`

const zoomOut = keyframes`
    0% {transform: scale(1);}
    100% {transform: scale(0.5);}
`

const ModalBase = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  position: fixed;
  max-height: 100%;
  user-select: none;

  animation-name: ${open};
  animation-duration: 0.2s;

  display: grid;
  overflow-y: auto;
  place-items: center;

  color: var(--foreground);
  background: rgba(0, 0, 0, 0.8);

  &.closing {
    animation-name: ${close};
    animation-fill-mode: forwards;
  }

  &.closing > div {
    animation-name: ${zoomOut};
  }
`
const ModalContainer = styled.div`
  overflow: hidden;
  max-width: calc(100vw - 20px);
  border-radius: var(--border-radius);

  animation-name: ${zoomIn};
  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.3, 0.3, 0.18, 1.1);
`

const ModalContent = styled.div<{ [key in 'attachment' | 'noBackground' | 'border' | 'padding']?: boolean }>`
  text-overflow: ellipsis;
  border-radius: var(--border-radius);

  h3 {
    font-size: 14px;
    text-transform: uppercase;
    margin: 0;
    margin-bottom: 10px;
    color: var(--foreground);
  }

  h5 {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-foreground);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 8px;

    > div {
      margin: 0;
      color: var(--secondary-foreground);
      font-size: 12px;
    }
  }

  ${(props) =>
    !props.noBackground &&
    css`
      background: var(--secondary-header);
    `}

  ${(props) =>
    props.padding &&
    css`
      padding: 1rem;
      min-width: 450px;
    `}

    ${(props) =>
    props.attachment &&
    css`
      border-radius: var(--border-radius) var(--border-radius) 0 0;
    `}

    ${(props) =>
    props.border &&
    css`
      border-radius: var(--border-radius);
      border: 2px solid var(--secondary-background);
    `}
`

const ModalActions = styled.div`
  gap: 8px;
  display: flex;
  flex-direction: row-reverse;
  padding: 1rem;
  background: var(--secondary-background);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
`
