interface SignupFormFieldValues {
  email: string
  password: string
  nickname: string
  code: string
}

interface LoginFormFieldValues extends Pick<SignupFormFieldValues, 'email' | 'password'> {}
