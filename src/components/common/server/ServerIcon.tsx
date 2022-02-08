import React from 'react'
import styled from 'styled-components'
import { ImageIconBase } from '../../ui/IconBase'

// types
import type { WorkspaceSchema } from '../../../api/schema/model'
import type { IconBaseProps } from '../../ui/IconBase'

interface Props extends IconBaseProps<WorkspaceSchema> {
  server_name?: string
}

type ServerIconProps = Props & Omit<React.ImgHTMLAttributes<HTMLImageElement>, keyof Props | 'children' | 'as'>

const ServerIcon: React.FC<ServerIconProps> = (props) => {
  const { target, attachment, size, animate, server_name, ...imgProps } = props

  const iconURL = undefined

  if (typeof iconURL === 'undefined') {
    const name = target?.name ?? server_name ?? ''

    return (
      <ServerText style={{ width: size, height: size }}>
        {name
          .split(' ')
          .map((x) => x[0])
          .filter((x) => typeof x !== 'undefined')
          .join('')
          .substring(0, 3)}
      </ServerText>
    )
  }

  return <ImageIconBase {...imgProps} width={size} height={size} borderRadius="--border-radius-server-icon" src={iconURL} loading="lazy" aria-hidden="true" />
}

export default ServerIcon

const ServerText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2em;
  font-size: 0.75rem;
  font-weight: 600;
  overflow: hidden;
  color: var(--foreground);
  background: var(--primary-background);
  border-radius: var(--border-radius-half);
`
