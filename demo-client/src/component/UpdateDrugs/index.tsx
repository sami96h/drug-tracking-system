/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react'
import { Formik, Form } from 'formik'
import {
  Button, Input, Form as AntForm, Divider, DatePicker,
} from 'antd'
import dayjs from 'dayjs'

import { validationSchema } from '../../validation/UpdateDrugs'
import './style.css'

const UpdateDrugs:FC = () => {
  const [receiptDate, setReceiptDate] = useState(dayjs().format('MM-DD-YYYY'))
  const [deliveryDate, setDeliveryDate] = useState(dayjs().format('MM-DD-YYYY'))

  return (
    <Formik
      initialValues={{
        batchId: '',
        vehicleId: '',
        shipNo: '',
        receiptDate,
        deliveryDate,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        setSubmitting(false)
      }}
    >
      {({
        values, errors, touched, handleChange, handleBlur, isSubmitting,
      }) => (
        <Form className="form-add-drugs">
          <Divider
            orientation="left"
            style={{
              color: 'rgb(0 21 41)',
              fontSize: '20px',
              fontWeight: '600',
            }}
          >
            Update Drug
          </Divider>
          <div className="form-item-container">

            <AntForm.Item
              validateStatus={
              errors.batchId && touched.batchId ? 'error' : 'success'
            }
              help={errors.batchId}
              className="form-item"
            >
              <label>BatchId</label>
              <Input
                name="batchId"
                placeholder="BatchId"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.batchId}
                className="form-item"
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
              errors.vehicleId && touched.vehicleId ? 'error' : 'success'
            }
              help={errors.vehicleId}
              className="form-item"
            >
              <label>VehicleId</label>
              <Input
                name="vehicleId"
                placeholder="VehicleId"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.vehicleId}
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
              errors.shipNo && touched.shipNo ? 'error' : 'success'
            }
              help={errors.shipNo}
              className="form-item"
            >
              <label>ShipNo</label>
              <Input
                name="shipNo"
                placeholder="ShipNo"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.shipNo}
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
                errors.receiptDate && touched.receiptDate ? 'error' : 'success'
              }
              help={errors.receiptDate}
              className="form-item"
            >
              <label>Receipt Date</label>
              <DatePicker
                className="date-picker"
                name="receiptDate"
                onChange={(e, dateString) => setReceiptDate(dateString)}
                defaultValue={dayjs(receiptDate)}
                onBlur={handleBlur}
                format="MM-DD-YYYY"
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
                errors.deliveryDate && touched.deliveryDate ? 'error' : 'success'
              }
              help={errors.deliveryDate}
              className="form-item"
            >
              <label>Delivery Date</label>
              <DatePicker
                className="date-picker"
                name="deliveryDate"
                onChange={(e, dateString) => setDeliveryDate(dateString)}
                defaultValue={dayjs(deliveryDate)}
                onBlur={handleBlur}
                format="MM-DD-YYYY"
              />
            </AntForm.Item>

            <Button
              // className="form-item"
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
              style={{ marginTop: '42px', display: 'block', minWidth: '300px' }}
            >
              Submit
            </Button>
          </div>

        </Form>
      )}
    </Formik>
  )
}

export default UpdateDrugs
