import * as yup from 'yup'
import { isObject, isUndefined } from '../utils'

function compact<T>(array: T[]): T[] {
  return array.filter(Boolean)
}

const isNullOrUndefined = (value: unknown): value is null | undefined => value == null

export function getError<T>(obj: T, path: string, defaultValue?: unknown): any {
  if (!path || !isObject(obj)) {
    return defaultValue
  }

  const result = compact(path.split(/[,[\].]+?/)).reduce((result, key) => (isNullOrUndefined(result) ? result : result[key as keyof {}]), obj)

  return isUndefined(result) || result === obj ? (isUndefined(obj[path as keyof T]) ? defaultValue : obj[path as keyof T]) : result
}

export const common = {
  email: yup.string().email('이메일 형식으로 입력해 주세요.'),
  password: yup.string().test('password', '비밀번호를 입력해 주세요.', (password) => {
    if (!password) return false
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-])(?=.{8,20})/
    if (password.match(regex)) {
      return true
    }
    return false
  }),
  nickname: yup.string().min(2, '2자 이상 입력해주세요.').max(20, '20자 이하로 입력해주세요.'),
}

export const schema = {
  signup: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
      .required('비밀번호를 입력해 주세요.'),
    nickname: common.nickname.required('닉네임을 입력해 주세요.'),
    code: yup.string().optional().notRequired(),
  }),
  signin: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
  }),
  changePassword: yup.object().shape({
    password: common.password.required('비밀번호를 입력해 주세요.'),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
      .required('비밀번호를 입력해 주세요.'),
  }),
  email: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
  }),
  worksacpe: {
    add: yup.object().shape({
      name: yup.string().max(20, '최대 글자수는 20자리 입니다.').required('워크스페이스를 입력해 주세요.'),
    }),
  },
  channel: {
    add: yup.object().shape({
      name: yup.string().max(20, '최대 글자수는 20자리 입니다.').required('채널를 입력해 주세요.'),
    }),
  },
}
