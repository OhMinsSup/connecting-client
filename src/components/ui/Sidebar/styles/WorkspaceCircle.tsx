import React from 'react'
import styled from 'styled-components'

const WorkspaceCircle: React.FC = (props) => {
  return <Block>{props.children}</Block>
}

export default WorkspaceCircle

const Block = styled.div`
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-background);
    border-radius: 50%;
    height: 42px;
    width: 42px;
    transition: background-color 0.1s ease-in;
    cursor: pointer;

    > div svg {
      color: var(--accent);
    }

    &:active {
      transform: translateY(1px);
    }
  }
`
