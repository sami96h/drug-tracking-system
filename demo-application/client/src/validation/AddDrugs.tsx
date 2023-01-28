import * as yup from 'yup'

export const validationSchema = yup.object({
  batchId: yup.string()
    .required('medicine name is required'),
  medicineName: yup.string()
    .required('medicine name is required'),

  companyName: yup.string()
    .required('company name is required'),

  pricePerBox: yup.number()
    .required('price is required'),

  amount: yup.number()
    .required('amount is required'),

  description: yup.string()
    .required('description is required'),

  productionDate: yup.date()
    .required('production date is required'),

  expiryDate: yup.date()
    .required('expiry date is required'),
})
