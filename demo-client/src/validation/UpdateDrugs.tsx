import * as yup from 'yup'

export const validationSchema = yup.object({
  batchId: yup.number()
    .required('batchId is required'),

  vehicleId: yup.number()
    .required('vehicleId is required'),

  shipNo: yup.number()
    .required('shipNo is required'),

  receiptDate: yup.date()
    .required('receipt date is required'),

  deliveryDate: yup.date()
    .required('delivery date is required'),
})
