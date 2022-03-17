import React from 'react'
import { Link } from 'react-router-dom'

// components
import { Home as HomeIcon } from '@styled-icons/boxicons-solid'
import Header from '../ui/Header'
import IconContainer from './IconContainer'

// styles
import styles from './style/home.module.scss'
import wideSVG from '../../assets/svg/wide.svg'
import CategoryButton from '../ui/CategoryButton'

const Home = () => {
  return (
    <div className={styles.home}>
      <Header placement="primary">
        <IconContainer onClick={console.log}>
          <HomeIcon size={24} />
        </IconContainer>
        <div>app.navigation.tabs.home</div>
      </Header>
      <h3>
        <div>app.special.modals.onboarding.welcome</div>

        <br />
        <img src={wideSVG} />
      </h3>
      <div className={styles.actions}>
        <Link to="/invite/Testers">
          {/* <CategoryButton action="chevron" icon={<Emoji emoji="😁" size={32} />}>
            {client.servers.get('01F7ZSBSFHQ8TA81725KQCSDDP') ? <Text id="app.home.goto-testers" /> : <Text id="app.home.join-testers" />}
          </CategoryButton> */}
          <CategoryButton action="chevron" icon={<>😁</>}>
            app.home.goto-testers
          </CategoryButton>
        </Link>
        <a href="https://insrt.uk/donate" target="_blank" rel="noreferrer">
          <CategoryButton action="chevron" icon={<>💷</>}>
            donate
          </CategoryButton>
          {/* <CategoryButton action="external" icon={<Emoji emoji="💷" size={32} />}>
            <Text id="app.home.donate" />
          </CategoryButton> */}
        </a>
        <Link to="/settings/feedback">
          {/* <CategoryButton action="chevron" icon={<Emoji emoji="🎉" size={32} />}>
            <Text id="app.home.feedback" />
          </CategoryButton> */}
          <CategoryButton action="chevron" icon={<>🎉</>}>
            feedback
          </CategoryButton>
        </Link>
        <a href="https://revolt.social" target="_blank" rel="noreferrer">
          {/* <CategoryButton action="external" icon={<Emoji emoji="🧭" size={32} />}>
            <Text id="app.home.social" />
          </CategoryButton> */}
          <CategoryButton action="chevron" icon={<>🧭</>}>
            social
          </CategoryButton>
        </a>
        {/* <Tooltip content={<Text id="app.home.settings-tooltip" />}>
          <Link to="/settings">
            <CategoryButton action="chevron" icon={<Emoji emoji="🔧" size={32} />}>
              <Text id="app.home.settings" />
            </CategoryButton>
          </Link>
        </Tooltip> */}
      </div>
    </div>
  )
}

export default Home
