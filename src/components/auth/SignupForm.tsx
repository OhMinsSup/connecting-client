import React, { useState } from 'react'

// hooks
import { useIsomorphicLayoutEffect } from 'react-use'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

// validator
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../libs/validation/schema'

// components
import Overline from '../ui/Form/Overline'
import InputBox from '../ui/Form/InputBox'
import Button from '../ui/Form/Button'
import Legal from '../ui/Form/Legal'

// api
import { api } from '../../api/module'

// utils
import { API_ENDPOINTS, PAGE_ENDPOINTS } from '../../constants'
import { generateKey, isAxiosError } from '../../libs/utils/utils'

// styles
import styles from '../../assets/styles/modules/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

// types
import type { SubmitHandler } from 'react-hook-form'

const initialValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
  code: undefined,
}

export interface SignupFormFieldValues {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  code?: string
}

const SignupForm: React.FC = () => {
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

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

  const onSubmit: SubmitHandler<SignupFormFieldValues> = async ({ code, passwordConfirm, ...input }) => {
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
        navigate(PAGE_ENDPOINTS.LOGIN.ROOT)
        return
      }

      const error = new Error()
      error.name = 'APIError'
      error.message = JSON.stringify(data)
      throw error
    } catch (error) {
      if (isAxiosError(error)) {
        setError('????????? ??????????????????.\n????????? ?????? ????????? ?????????.')
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

  // ?????? ????????? ?????? ????????? ?????? ?????? ????????? ??????????????? ??????.
  useIsomorphicLayoutEffect(() => {
    if (code) setValue('code', code)
  }, [code])

  const disabled = !isDirty || !isValid

  return (
    <div className={styles.form}>
      <img src={wideSVG} alt="wide" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <Overline formKey="email" errors={errors}>
            ?????????
          </Overline>
          <InputBox type="text" placeholder="???????????? ???????????????." className="fbc-has-badge" {...register('email')} />
        </>
        <>
          <Overline formKey="password" errors={errors}>
            ????????????
          </Overline>
          <InputBox type="password" autoComplete="on" placeholder="??????????????? ???????????????." className="fbc-has-badge" {...register('password')} />
        </>
        <>
          <Overline formKey="passwordConfirm" errors={errors}>
            ???????????? ??????
          </Overline>
          <InputBox type="password" autoComplete="on" placeholder="???????????? ????????? ???????????????." className="fbc-has-badge" {...register('passwordConfirm')} />
        </>
        <>
          <Overline formKey="nickname" errors={errors}>
            ?????????
          </Overline>
          <InputBox type="text" placeholder="???????????? ???????????????." className="fbc-has-badge" {...register('nickname')} />
        </>
        <>
          <Overline formKey="inviteCode" errors={errors}>
            ????????????
          </Overline>
          <InputBox type="text" placeholder="?????? ????????? ???????????????." className="fbc-has-badge" {...register('code')} />
        </>
        <Button type="submit" disabled={disabled}>
          ??????
        </Button>
        {error && <Overline type="error">{error}</Overline>}
      </form>
      <span className={styles.create}>
        ?????? ????????? ????????????????
        <Link to={PAGE_ENDPOINTS.LOGIN.ROOT}>?????????</Link>
      </span>
      <Legal />
    </div>
  )
}

export default SignupForm
