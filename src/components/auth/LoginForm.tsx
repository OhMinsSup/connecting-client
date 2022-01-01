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

// utils
import { API_ENDPOINTS, PAGE_ENDPOINTS } from '../../constants'

import type { SubmitHandler } from 'react-hook-form'
import { isAxiosError } from '../../libs/utils/utils'
import { api } from '../../api/module'

const initialValues = {
  email: '',
  password: '',
}

interface SignupFormProps {}
const SignupForm: React.FC<SignupFormProps> = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginFormFieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.signin),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<LoginFormFieldValues> = async (input) => {
    try {
      const { data } = await api.post<{ accessToken: string }>({
        url: API_ENDPOINTS.USERS.LOGIN,
        body: input,
      })

      if (data.ok) {
        return
      }

      const error = new Error()
      error.name = 'APIError'
      error.message = JSON.stringify(data)
      throw error
    } catch (error) {
      if (isAxiosError(error)) {
        throw error
      }

      if (error instanceof Error) {
        // custom error
        const { message } = error
        const parsedError = JSON.parse(message)
        console.log(parsedError)
      }
    }
  }

  const disabled = !isDirty || !isValid

  return (
    <div className={styles.form}>
      <img className="lazyload" src={wideSVG} alt="wide" />
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
          <InputBox type="password" placeholder="비밀번호를 입력하세요." className="fbc-has-badge" {...register('password')} />
        </>
        <Button type="submit" disabled={disabled}>
          로그인
        </Button>
      </form>
      <span className={styles.create}>
        Connecting이 처음이신가요?
        <Link to={PAGE_ENDPOINTS.SIGNUP.ROOT}>회원가입</Link>
      </span>
      <span className={styles.create}>
        비밀번호를 잊어버렸나요?
        <Link to={PAGE_ENDPOINTS.LOGIN.RESEND}>비밀번호 재설정</Link>
      </span>
      <Legal />
    </div>
  )
}

export default SignupForm
