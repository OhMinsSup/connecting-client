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
  password: '',
}

interface SignupFormProps {}
const SignupForm: React.FC<SignupFormProps> = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormFieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.signin),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<LoginFormFieldValues> = (input) => {
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
        <>
          <Overline formKey="password" errors={errors}>
            비밀번호
          </Overline>
          <InputBox type="text" placeholder="비밀번호를 입력하세요." className="fbc-has-badge" {...register('password')} />
        </>
        <Button type="submit">가입</Button>
      </form>
      <span className={styles.create}>
        Connecting이 처음이신가요?
        <Link to="/signup">회원가입</Link>
      </span>
      <span className={styles.create}>
        비밀번호를 잊어버렸나요?
        <Link to="/signup">비밀번호 재설정</Link>
      </span>
      <Legal />
    </div>
  )
}

export default SignupForm
