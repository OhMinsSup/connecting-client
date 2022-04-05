import React from 'react'
import styled from 'styled-components'

// icons
import { Home as HomeIcon } from '@styled-icons/boxicons-solid'

// styles
import styles from '../assets/styles/modules/home.module.scss'
import { PageHeader } from '../components/ui/Header'

// components

interface HomePageProps {}
const HomePage: React.FC<HomePageProps> = () => {
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

export default HomePage

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
