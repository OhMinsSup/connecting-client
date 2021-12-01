import React from 'react'

// hooks
import { Link } from 'react-location'

// validator
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../libs/validation/schema'

// components
import Overline from '../ui/Overline'
import InputBox from '../ui/InputBox'
import Button from '../ui/Button'
import Legal from './common/Legal'

// styles
import styles from './style/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

import type { SubmitHandler } from 'react-hook-form'

const initialValues = {
  email: '',
}

interface ResendFormProps {
  isReset?: boolean
}
const ResendForm: React.FC<ResendFormProps> = ({ isReset }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<typeof initialValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.resned),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<typeof initialValues> = (input) => {
    console.log(input)
  }

  return (
    <div className={styles.form}>
      <img src={wideSVG} alt="wide" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <Overline formKey="email" errors={errors}>
            이메일
          </Overline>
          <InputBox type="text" placeholder="이메일을 입력하세요." className="fbc-has-badge" {...register('email')} />
        </>
        <Button type="submit">{isReset ? '비밀번호 재설정' : '인증 메일 재전송'}</Button>
      </form>
      <span className={styles.create}>
        <Link to="/login">로그인으로 돌아가기.</Link>
      </span>
      <Legal />
    </div>
  )
}

export default ResendForm
