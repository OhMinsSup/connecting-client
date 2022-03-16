export interface SignupFormFieldValues {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  code?: string
}

export interface LoginFormFieldValues extends Pick<SignupFormFieldValues, 'email' | 'password'> {}
