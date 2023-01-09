/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react'
import {
  Button, Input, Form as AntForm, Select,
} from 'antd'
import { Form, Formik } from 'formik'
import loginCover from '../../../assets/image/login-cover.png'
import { validationSchema } from '../../../validation/Register'
import './style.css'

const options = [
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
]
const Register:FC = () => {
  const [role, setRole] = useState<string|null>(null)

  const handleChangeRole = (value:string, setFieldValue:any):void => {
    setFieldValue('role', value)
    setRole(value)
  }

  return (
    <div className="login-container">
      <Formik
        initialValues={{
          role,
          username: '',
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
          <Form className="login-form">
            <div className="login-msg">
              <h2>Register User</h2>
              <p>Login into your account</p>
            </div>

            <div className="form-item-container">
              <AntForm.Item
                validateStatus={
              errors.role && touched.role ? 'error' : 'success'
            }
                help={errors.role}
                className="form-item"
              >
                <label>Role</label>
                <Select
                  placeholder="Select Role"
                  onChange={(e:string) => handleChangeRole(e, setFieldValue)}
                  value={role}
                  onBlur={handleBlur}
                  className="form-item"
                  options={options}
                />

              </AntForm.Item>
              <AntForm.Item
                validateStatus={
              errors.username && touched.username ? 'error' : 'success'
            }
                help={errors.username}
                className="form-item"
              >
                <label>Username</label>
                <Input
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  className="form-item"
                />
              </AntForm.Item>

              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubmitting}
                color="#2a2a2a"
                style={{ backgroundColor: '#2a2a2a', width: '100%' }}
              >
                Submit
              </Button>
            </div>

          </Form>
        )}
      </Formik>
      <img src={loginCover} alt="" />
    </div>
  )
}

export default Register
