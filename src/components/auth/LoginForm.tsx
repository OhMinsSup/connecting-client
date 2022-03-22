import React, { useState } from 'react'

// hooks
import { Link, useNavigate } from 'react-router-dom'

// validator
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../libs/validation/schema'

// components
import Overline from '../ui/Overline'
import InputBox from '../ui/InputBox'
import Button from '../ui/Button'
import Legal from './Legal'

// styles
import styles from '../../assets/styles/modules/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

// utils
import { API_ENDPOINTS, PAGE_ENDPOINTS } from '../../constants'
import { isAxiosError } from '../../libs/utils/utils'

// api
import { api } from '../../api/module'

// hooks
import { useMutateProfile } from '../../atoms/authState'

// types
import type { SubmitHandler } from 'react-hook-form'
import type { LoginFormFieldValues } from './types/form'

const initialValues = {
  email: '',
  password: '',
}

const LoginForm: React.FC = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate()

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

  const setProfile = useMutateProfile()

  const onSubmit: SubmitHandler<LoginFormFieldValues> = async (input) => {
    try {
      const { data } = await api.post<{ accessToken: string }>({
        url: API_ENDPOINTS.USERS.LOGIN,
        body: input,
      })

      if (data.ok) {
        const { result } = data
        localStorage.setItem('@@Connecting-Web-App/token', result.accessToken)
        await setProfile(result.accessToken)
        navigate(PAGE_ENDPOINTS.INDEX)
        return
      }

      const error = new Error()
      error.name = 'APIError'
      error.message = JSON.stringify(data)
      throw error
    } catch (error) {
      if (isAxiosError(error)) {
        setError('오류가 발생했습니다.\n나중에 다시 시도해 주세요.')
        throw error
      }

      // custom error
      if (error instanceof Error) {
        const { message } = error
        const parsedError = JSON.parse(message)
        setError(parsedError.message)
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
          <InputBox type="password" autoComplete="on" placeholder="비밀번호를 입력하세요." className="fbc-has-badge" {...register('password')} />
        </>
        <Button type="submit" disabled={disabled}>
          로그인
        </Button>
        {error && <Overline type="error">{error}</Overline>}
      </form>
      <span className={styles.create}>
        Connecting이 처음이신가요?
        <Link to={PAGE_ENDPOINTS.SIGNUP.ROOT}>회원가입</Link>
      </span>
      <span className={styles.create}>
        비밀번호를 잊어버렸나요?
        <Link to={PAGE_ENDPOINTS.RESET_PASSWORD.ROOT}>비밀번호 재설정</Link>
      </span>
      <Legal />
    </div>
  )
}

export default LoginForm
