import * as yup from 'yup'

export const UpdateUserRoleSchema = yup.object({
  id: yup.string().required(),
  roles: yup.array().of(yup.string().required()).min(1).required(),
})
