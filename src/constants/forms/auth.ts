import * as yup from 'yup'

export const LoginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 6 characters').required('Password is required'),
})

export type LoginValues = yup.InferType<typeof LoginSchema>
