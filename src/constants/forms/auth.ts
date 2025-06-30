import * as yup from 'yup'

export const LoginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 6 characters').required('Password is required'),
})

export const ForgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
})

export const ResetPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  token: yup.string().nullable(),
  password: yup.string().min(8, 'Password must be at least 6 characters').required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
})

export type LoginValues = yup.InferType<typeof LoginSchema>
export type ForgotPasswordValues = yup.InferType<typeof ForgotPasswordSchema>
export type ResetPasswordValues = yup.InferType<typeof ResetPasswordSchema>
