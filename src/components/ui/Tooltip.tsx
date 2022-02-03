import React from 'react'
import Tippy from '@tippyjs/react'
import styled from 'styled-components'

import type { TippyProps } from '@tippyjs/react'

interface TooltipProps extends Omit<TippyProps, 'children'> {
  children: React.ReactNode
  content: React.ReactNode
}

function Tooltip(props: TooltipProps) {
  const { children, content, ...tippyProps } = props

  return (
    <Tippy content={content} animation="shift-away" {...tippyProps}>
      <div style={{ display: 'flex' }}>{children}</div>
    </Tippy>
  )
}

export default Tooltip

const PermissionTooltipBase = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  span {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--secondary-foreground);
  }

  code {
    font-family: var(--monospace-font);
  }
`

Tooltip.PermissionTooltip = function PermissionTooltip(props: Omit<TooltipProps, 'content'> & { permission: string }) {
  const { permission, ...tooltipProps } = props

  return (
    <Tooltip
      content={
        <PermissionTooltipBase>
          <span>권한이 필요합니다</span>
          <code>{permission}</code>
        </PermissionTooltipBase>
      }
      {...tooltipProps}
    />
  )
}
