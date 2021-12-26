import React from 'react'

// hooks
import { useSearch, Link } from 'react-location'
import { useIsomorphicLayoutEffect } from 'react-use'

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
import { api } from '../../api/module'
import { API_ENDPOINTS, RESULT_CODE } from '../../constants'
import { isAxiosError } from '../../libs/utils/utils'

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

interface SignupFormProps {}
const SignupForm: React.FC<SignupFormProps> = () => {
  const search = useSearch<LocationGenerics>()

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
      }

      const res = await api.post<boolean>({
        url: API_ENDPOINTS.USERS.SIGNUP,
        body,
      })

      if (res.data.resultCode === RESULT_CODE.OK) {
        // TODO: 회원가입 성공
        return
      }

      // TODO: 회원가입 실패

      const error = new Error()
      error.name = res.data.resultCode.toString()
      error.message = res.data.message ?? '회원가입 실패'
      throw error
    } catch (error) {
      beforeRethrow(error)
      throw error
    }
  }

  const beforeRethrow = (error: unknown) => {
    console.error(error)
    if (isAxiosError(error)) {
      return
    }
    return
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
      </form>
      <span className={styles.create}>
        이미 계정이 있으신가요?
        <Link to="/login">로그인</Link>
      </span>
      <Legal />
    </div>
  )
}

export default SignupForm
