import * as yup from 'yup'

export const validationSchema = yup.object({
  role: yup.string()
    .required('role is required'),
  username: yup.string()
    .required('username is required'),

})
