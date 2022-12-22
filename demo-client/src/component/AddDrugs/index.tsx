/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react'
import { Formik, Form } from 'formik'
import {
  Button, Input, Form as AntForm, Divider, DatePicker,
} from 'antd'
import dayjs from 'dayjs'

import { validationSchema } from '../../validation/AddDrugs'

import './style.css'

const AddDrugs:FC = () => {
  const [productionDate, setProductionDate] = useState(dayjs().format('MM-DD-YYYY'))
  const [expiryDate, setExpiryDate] = useState(dayjs().format('MM-DD-YYYY'))

  return (
    <Formik
      initialValues={{
        medicineName: '', price: 0, amount: 0, companyName: '', productionDate, expiryDate,
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
            Add Drug
          </Divider>
          <div className="form-item-container">

            <AntForm.Item
              validateStatus={
              errors.medicineName && touched.medicineName ? 'error' : 'success'
            }
              help={errors.medicineName}
              className="form-item"
            >
              <label>Medicine Name</label>
              <Input
                name="medicineName"
                placeholder="Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.medicineName}
                className="form-item"
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
              errors.price && touched.price ? 'error' : 'success'
            }
              help={errors.price}
              className="form-item"
            >
              <label>Price</label>
              <Input
                name="price"
                placeholder="price"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.price}
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
                errors.productionDate && touched.productionDate ? 'error' : 'success'
              }
              help={errors.productionDate}
              className="form-item"
            >
              <label>Production Date</label>
              <DatePicker
                className="date-picker"
                name="productionDate"
                onChange={(e, dateString) => setProductionDate(dateString)}
                defaultValue={dayjs(productionDate)}
                onBlur={handleBlur}
                format="MM-DD-YYYY"
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
                errors.expiryDate && touched.expiryDate ? 'error' : 'success'
              }
              help={errors.expiryDate}
              className="form-item"
            >
              <label>Expiry Date</label>
              <DatePicker
                className="date-picker"
                name="expiryDate"
                onChange={(e, dateString) => setExpiryDate(dateString)}
                defaultValue={dayjs(productionDate)}
                onBlur={handleBlur}
                format="MM-DD-YYYY"
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
                errors.companyName && touched.companyName ? 'error' : 'success'
              }
              help={errors.companyName}
              className="form-item"
            >
              <label>Company Name</label>
              <Input
                name="companyName"
                placeholder="Company Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.companyName}
                className="form-item"
              />
            </AntForm.Item>

            <AntForm.Item
              validateStatus={
              errors.amount && touched.amount ? 'error' : 'success'
            }
              help={errors.amount}
              className="form-item"
            >
              <label>Amount</label>
              <Input
                name="amount"
                placeholder="Amount"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.amount}
              />
            </AntForm.Item>

          </div>

          <Button
            className="add-drugs-btn"
            type="primary"
            htmlType="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default AddDrugs
