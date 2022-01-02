import React, { useState } from 'react'

// hooks
import { useSearch, Link, useNavigate } from 'react-location'
import { useIsomorphicLayoutEffect } from 'react-use'

// validator
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../libs/validation/schema'

// components
import Overline from '../ui/Overline'
import InputBox from '../ui/InputBox'
import Button from '../ui/Button'
import { Legal } from './common'

// api
import { api } from '../../api/module'

// utils
import { API_ENDPOINTS, PAGE_ENDPOINTS } from '../../constants'
import { generateKey, isAxiosError } from '../../libs/utils/utils'

// styles
import styles from './style/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

// types
import type { SubmitHandler } from 'react-hook-form'
import type { MakeGenerics } from 'react-location'
import type { SignupFormFieldValues } from './type/form'

type LocationGenerics = MakeGenerics<{
  Search: {
    code: string
  }
}>

const initialValues = {
  email: '',
  password: '',
  nickname: '',
  code: undefined,
}

const SignupForm: React.FC = () => {
  const [error, setError] = useState('')
  const search = useSearch<LocationGenerics>()
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<SignupFormFieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.signup),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<SignupFormFieldValues> = async ({ code, ...input }) => {
    try {
      const body = {
        ...input,
        code: code || undefined,
        avatarSvg: generateKey(),
      }

      const { data } = await api.post({
        url: API_ENDPOINTS.USERS.SIGNUP,
        body,
      })

      if (data.ok) {
        navigate({ to: PAGE_ENDPOINTS.LOGIN.ROOT, replace: true })
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

  // 초대 코드를 타고 들어온 경우 초대 코드를 입력하도록 한다.
  useIsomorphicLayoutEffect(() => {
    if (search.code) setValue('code', search.code)
  }, [search])

  const disabled = !isDirty || !isValid

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
          <InputBox type="password" placeholder="비밀번호를 입력하세요." className="fbc-has-badge" {...register('password')} />
        </>
        <>
          <Overline formKey="nickname" errors={errors}>
            닉네임
          </Overline>
          <InputBox type="text" placeholder="닉네임을 입력하세요." className="fbc-has-badge" {...register('nickname')} />
        </>
        <>
          <Overline formKey="inviteCode" errors={errors}>
            초대코드
          </Overline>
          <InputBox type="text" placeholder="초대 코드를 입력하세요." className="fbc-has-badge" {...register('code')} />
        </>
        <Button type="submit" disabled={disabled}>
          가입
        </Button>
        {error && <Overline type="error">{error}</Overline>}
      </form>
      <span className={styles.create}>
        이미 계정이 있으신가요?
        <Link to={PAGE_ENDPOINTS.LOGIN.ROOT}>로그인</Link>
      </span>
      <Legal />
    </div>
  )
}

export default SignupForm
