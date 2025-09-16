import * as yup from 'yup'

export const OauthClientSchema = yup.object({
  name: yup.string().required('Nama client wajib diisi'),
  secret: yup.string().required('Secret wajib diisi'),
  redirect: yup.string().url('Redirect harus berupa URL').required('Redirect wajib diisi'),
})

export type OauthClientValues = yup.InferType<typeof OauthClientSchema>
