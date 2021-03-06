import React, { useState } from 'react'

// hooks
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

// validator
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../libs/validation/schema'

import { api } from '../../api/module'
import { API_ENDPOINTS, PAGE_ENDPOINTS } from '../../constants'
import { isAxiosError } from '../../libs/utils/utils'

// components
import Overline from '../ui/Form/Overline'
import InputBox from '../ui/Form/InputBox'
import Button from '../ui/Form/Button'
import Legal from '../ui/Form/Legal'
import { Modal } from '../ui/Modal'

// styles
import styles from '../../assets/styles/modules/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

import type { SubmitHandler } from 'react-hook-form'

const initialValues = {
  password: '',
  passwordConfirm: '',
}

interface ChangePasswordFormProps {}
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = () => {
  const [err, setErr] = useState<string | boolean | undefined>()
  const [success, setSuccess] = useState<boolean>(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<typeof initialValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.changePassword),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<typeof initialValues> = async (input) => {
    try {
      setErr(false)
      setSuccess(false)

      const { data } = await api.put({
        url: API_ENDPOINTS.USERS.CHANGE_PASSWORD,
        body: {
          ...input,
          code,
        },
      })

      if (data.ok) {
        setSuccess(true)
        return
      } else {
        const error = new Error()
        error.name = 'ApiError'
        error.message = JSON.stringify(data)
        throw error
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setErr(true)
        throw error
      } else if (error instanceof Error && error.name === 'ApiError') {
        const { message } = JSON.parse(error.message)
        setErr(message)
      }
    }
  }

  const disabled = !isDirty || !isValid

  return (
    <>
      <div className={styles.form}>
        <img src={wideSVG} alt="wide" />
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Button type="submit" disabled={disabled}>
            ???????????? ????????????
          </Button>
        </form>
        <span className={styles.create}>
          <Link to={PAGE_ENDPOINTS.LOGIN.ROOT}>??????????????? ????????????.</Link>
        </span>
        <Legal />
      </div>
      {/* ?????? ?????? */}
      <Modal
        visible={!!err}
        onClose={() => false}
        title={'???????????? ????????????'}
        actions={[
          {
            onClick: () => setErr(false),
            confirmation: true,
            children: '??????',
          },
        ]}
      >
        {typeof err === 'string' ? (
          err
        ) : (
          <div>
            ????????? ??????????????????
            <br />
            ?????? ?????? ??????????????????.
          </div>
        )}
      </Modal>
      {/* ?????? ?????? */}
      <Modal
        visible={success}
        onClose={() => false}
        title={'???????????? ????????????'}
        actions={[
          {
            onClick: () => {
              setSuccess(false)
              navigate(PAGE_ENDPOINTS.LOGIN.ROOT)
            },
            confirmation: true,
            children: '??????',
          },
        ]}
      >
        <div>??????????????? ?????????????????????.</div>
      </Modal>
    </>
  )
}

export default ChangePasswordForm
