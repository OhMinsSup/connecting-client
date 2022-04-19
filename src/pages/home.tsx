import React from 'react'
import styled from 'styled-components'

// icons
import { Home as HomeIcon, Cog, PlusCircle } from '@styled-icons/boxicons-solid'

// styles
import styles from '../assets/styles/modules/home.module.scss'
import { PageHeader } from '../components/ui/Header'

// components
import { Link } from 'react-router-dom'
import { CategoryButton } from '../components/ui/Form'

interface HomePageProps {}
const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className={styles.home}>
      <Overlay>
        <div className="content">
          <PageHeader icon={<HomeIcon size={24} />} transparent>
            홈
          </PageHeader>
          <div className={styles.homeScreen}>
            <h3>
              <div>환영합니다!</div>
              Connecting
            </h3>
            <div className={styles.actions}>
              <Link to="/settings">
                <CategoryButton action="chevron" icon={<PlusCircle size={32} />} description={`모든 친구들과 멋진 봇들을 초대해서 큰 파티를 열어보세요.`}>
                  그룹 만들기
                </CategoryButton>
              </Link>

              <Link to="/settings">
                <CategoryButton
                  action="chevron"
                  description={`왼쪽 상단에 있는 사용자 아이콘을 마우스 우클릭하거나 이미 홈에 있는 경우 좌클릭할 수도 있습니다.`}
                  icon={<Cog size={32} />}
                >
                  설정열기
                </CategoryButton>
              </Link>
            </div>
          </div>
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
