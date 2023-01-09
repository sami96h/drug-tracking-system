/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react'
import {
  Button, Input, Form as AntForm,
} from 'antd'
import { Form, Formik } from 'formik'
import loginCover from '../../assets/image/login-cover.png'
import { validationSchema } from '../../validation/login'
import './style.css'

const Login:FC = () => {
  console.log('first')
  return (
    <div className="login-container">
      <Formik
        initialValues={{
          username: '',
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
          <Form className="login-form">
            <div className="login-msg">
              <h2>Welcome Back!</h2>
              <p>Login into your account</p>
            </div>

            <div className="form-item-container">

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

export default Login
