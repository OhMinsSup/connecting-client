import React from 'react'
import styled from 'styled-components'

const LineDivider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return <LineDividerBlock>{children}</LineDividerBlock>
}

export default LineDivider

const LineDividerBlock = styled.div`
  height: 0;
  opacity: 0.6;
  flex-shrink: 0;
  margin: 8px 15px;
  border-top: 1px solid var(--tertiary-foreground);
`
