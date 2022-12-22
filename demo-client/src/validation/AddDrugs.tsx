import * as yup from 'yup'

export const validationSchema = yup.object({
  medicineName: yup.string()
    .required('medicine name is required'),

  companyName: yup.string()
    .required('company name is required'),

  price: yup.number()
    .required('price is required'),

  amount: yup.number()
    .required('amount is required'),

  productionDate: yup.date()
    .required('production date is required'),

  expiryDate: yup.date()
    .required('expiry date is required'),
})
