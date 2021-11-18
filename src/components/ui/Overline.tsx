import React from 'react'
import styled, { css } from 'styled-components'

import type { HTMLAttributes } from 'react'
import type { FieldError } from 'react-hook-form'

type OverlineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'as'> & {
  errors?: Record<string, FieldError>
  formKey?: string
  hover?: boolean
  block?: boolean
  spaced?: boolean
  noMargin?: boolean
  children?: React.ReactNode
  type?: 'default' | 'subtle' | 'error' | 'accent'
}

const OverlineBase = styled.div<Omit<OverlineProps, 'children' | 'error'>>`
  display: inline;
  transition: 0.2s ease filter;
  ${(props) =>
    props.hover &&
    css`
      cursor: pointer;
      transition: 0.2s ease filter;
      &:hover {
        filter: brightness(1.2);
      }
    `}
  ${(props) =>
    !props.noMargin &&
    css`
      margin: 0.4em 0;
    `}
    ${(props) =>
    props.spaced &&
    css`
      margin-top: 0.8em;
    `}
    font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  text-transform: uppercase;
  ${(props) =>
    props.type === 'subtle' &&
    css`
      font-size: 12px;
      color: var(--secondary-foreground);
    `}
  ${(props) =>
    props.type === 'error' &&
    css`
      font-size: 12px;
      font-weight: 400;
      color: var(--error);
    `}
    ${(props) =>
    props.type === 'accent' &&
    css`
      font-size: 12px;
      font-weight: 400;
      color: var(--accent);
    `}
    ${(props) =>
    props.block &&
    css`
      display: block;
    `}
`

const Overline: React.FC<OverlineProps> = (props) => {
  const { children, errors, formKey, ...rest } = props

  const key = formKey ?? ''
  const error = errors?.[key]

  return (
    <OverlineBase {...rest}>
      {children}
      {children && error && <> &middot; </>}
      {error?.message && <Overline type="error">{error.message}</Overline>}
    </OverlineBase>
  )
}

export default Overline
