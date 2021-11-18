import React from 'react'

// hooks
import { useSearch, Link } from 'react-location'

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
import type { MakeGenerics } from 'react-location'

type LocationGenerics = MakeGenerics<{
  Search: {
    code: string
  }
}>

const initialValues = {
  email: '',
  password: '',
  inviteCode: '',
}

interface SignupFormProps {}
const SignupForm: React.FC<SignupFormProps> = () => {
  const search = useSearch<LocationGenerics>()
  console.log(search)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupFormFieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.signup),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<SignupFormFieldValues> = (input) => {
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
        <>
          <Overline formKey="inviteCode" errors={errors}>
            초대코드
          </Overline>
          <InputBox type="text" placeholder="초대 코드를 입력하세요." className="fbc-has-badge" {...register('inviteCode')} />
        </>
        <Button type="submit">가입</Button>
      </form>
      <span className={styles.create}>
        이미 계정이 있으신가요?
        <Link to="/login">로그인</Link>
      </span>
      <span className={styles.create}>
        이메일이 없어요
        <Link to="/login/resend">인증 메일 재전송.</Link>
      </span>
      <Legal />
    </div>
  )
}

export default SignupForm
