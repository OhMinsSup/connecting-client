import * as yup from 'yup'

export const common = {
  email: yup.string().email('이메일 형식으로 입력해 주세요.'),
  password: yup.string().test('password', '비밀번호를 입력해 주세요.', (password) => {
    if (!password) return false
    const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%&^*+=-\d])(?=.*[0-9]).{8,20}$/
    if (password.match(regex)) {
      return true
    }
    return false
  }),
}

export const schema = {
  signup: yup.object().shape({
    email: common.email.required('이메일을 입력해 주세요.'),
    password: common.password.required('비밀번호를 입력해 주세요.'),
    inviteCode: yup.string().required('초대코드를 입력해 주세요.'),
  }),
}
