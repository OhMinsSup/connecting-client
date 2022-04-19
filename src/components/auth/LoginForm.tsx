import React, { useMemo, useState } from 'react'

// hooks
import { Link } from 'react-router-dom'

// validator
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../libs/validation/schema'
import { useLoginMutation } from '../../api/mutations/login'

// components
import { Legal, Button, InputBox, Overline } from '../ui/Form'

// styles
import styles from '../../assets/styles/modules/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

// utils
import { PAGE_ENDPOINTS } from '../../constants'

// types
import type { SubmitHandler } from 'react-hook-form'
import type { SignupFormFieldValues } from './SignupForm'

export interface LoginFormFieldValues extends Pick<SignupFormFieldValues, 'email' | 'password'> {}

const LoginForm: React.FC = () => {
  const [error, setError] = useState('')

  const initialValues = useMemo(
    () => ({
      email: '',
      password: '',
    }),
    [],
  )

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

  const { mutate } = useLoginMutation()

  const onSubmit: SubmitHandler<LoginFormFieldValues> = async (input) => {
    const result = await mutate(input)
    if (!result.ok && result.message) {
      setError(result.message)
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
