import React from 'react'
import styled from 'styled-components'

// icons
import { Home as HomeIcon } from '@styled-icons/boxicons-solid'

// styles
import styles from '../../assets/styles/modules/home.module.scss'

// components
import { PageHeader } from '../ui/Header'

interface HomeViewProps {}
const HomeView: React.FC<HomeViewProps> = () => {
  return (
    <div className={styles.home}>
      <Overlay>
        <div className="content">
          <PageHeader icon={<HomeIcon size={24} />} transparent>
            홈
          </PageHeader>
          <div className={styles.homeScreen}>??</div>
        </div>
      </Overlay>
    </div>
  )
}

export default HomeView

const Overlay = styled.div`
  display: grid;
  height: 100%;

  > * {
    grid-area: 1 / 1;
  }

  .content {
    z-index: 1;
  }
`
