import React from 'react'
import styles from '../../../assets/styles/modules/auth.module.scss'

const Legal: React.FC = () => {
  return (
    <span className={styles.footer}>
      <a href="" target="_blank" rel="noreferrer">
        소개
      </a>
      &middot;
      <a href="" target="_blank" rel="noreferrer">
        이용 약관
      </a>
      &middot;
      <a href="" target="_blank" rel="noreferrer">
        개인정보 처리 방침
      </a>
    </span>
  )
}

export default Legal
