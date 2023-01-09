import * as yup from 'yup'

export const validationSchema = yup.object({
  username: yup.string()
    .required('username name is required'),
})
