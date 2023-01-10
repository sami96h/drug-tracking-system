/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react'
import { Formik, Form } from 'formik'
import {
  Button, Input, Form as AntForm, Divider, DatePicker,
} from 'antd'
import dayjs from 'dayjs'

import { validationSchema } from '../../validation/AddDrugs'
import './style.css'
import Uploader from '../UploadImage'

const { TextArea } = Input

const AddDrugs:FC = () => {
  const [productionDate, setProductionDate] = useState(dayjs().format('MM-DD-YYYY'))
  const [expiryDate, setExpiryDate] = useState(dayjs().format('MM-DD-YYYY'))
  const [imageUrl, setImageUrl] = useState<string>('')
  console.log(' in add drug form', imageUrl)

  return (
    <Formik
      initialValues={{
        batchId: '',
        medicineName: '',
        price: '',
        amount: '',
        companyName: '',
        description: '',
        image: imageUrl,
        productionDate,
        expiryDate,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        setSubmitting(false)
      }}
    >
      {({
        values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue,
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
              errors.batchId && touched.batchId ? 'error' : 'success'
            }
              help={errors.batchId}
              className="form-item"
            >
              <label>Batch Id</label>
              <Input
                name="batchId"
                placeholder="Batch Id"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.batchId}
                className="form-item"
              />
            </AntForm.Item>

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

            <AntForm.Item
              validateStatus={
              errors.description && touched.description ? 'error' : 'success'
            }
              help={errors.description}
              className="text-area"
            >
              <label>Description</label>
              <TextArea
                rows={4}
                name="description"
                placeholder="Description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
              />

            </AntForm.Item>

            <AntForm.Item
              validateStatus={
              errors.image && touched.image ? 'error' : 'success'
            }
              help={errors.image}
              className="form-item"
            >
              <Uploader
                setImageUrl={setImageUrl}
                setFieldValue={setFieldValue}
              />
            </AntForm.Item>

            <Button
              className="form-item"
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>

        </Form>
      )}
    </Formik>
  )
}

export default AddDrugs
