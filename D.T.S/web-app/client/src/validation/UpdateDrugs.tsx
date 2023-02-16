import * as yup from 'yup'

export const validationSchema = yup.object({

  vehicleId: yup.string()
    .required('vehicleId is required'),

  shipNo: yup.string()
    .required('shipNo is required'),

  receiptDate: yup.date()
    .required('receipt date is required'),

  deliveryDate: yup.date()
    .required('delivery date is required'),
})
