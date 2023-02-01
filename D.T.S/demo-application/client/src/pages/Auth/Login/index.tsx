/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useEffect, useState } from 'react'
import {
  Button, Input, Form as AntForm, Select,
} from 'antd'
import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import loginCover from '../../../assets/image/login-cover.png'
import { validationSchema } from '../../../validation/login'
import './style.css'
import { login } from '../../../api/login'
import useAuth from '../../../hooks/useAuth'

const Login: FC = () => {
  const [Org, setOrg] = useState<string>('org1')
  const navigate = useNavigate()
  const { auth, dispatch } = useAuth()
  useEffect(
    () => {
      if (auth.loggedIn) {
        navigate('/home')
      }
    },
    [auth.loggedIn],
  )
  const handleLogIn = async (values: any):Promise<void> => {
    try {
      const { user: { username, org } } = await login(values)
      dispatch?.({
        type: 'LOGIN',
        payload: { user: { username, org } },
      })
    } catch (err: any) {
      if (err?.response.status === 401) {
        toast.error('Invalid Credentials')
      }
    }
  }

  return (
    <div className="login-container">
      <Formik
        initialValues={{
          username: '',
          password: '',
          Org,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleLogIn(values)
          setSubmitting(false)
        }}
      >
        {({
          values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue,
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

              <AntForm.Item
                validateStatus={
                  errors.password && touched.password ? 'error' : 'success'
                }
                help={errors.password}
                className="form-item"
              >
                <label>Password</label>
                <Input
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="form-item"
                  type="password"
                />
              </AntForm.Item>
              <Select
                defaultValue="org1"
                style={{ width: 180 }}
                onChange={(value) => {
                  setFieldValue('Org', value)
                  setOrg(value)
                }}
                options={[
                  { value: 'org1', label: 'Manufacturer' },
                  { value: 'org2', label: 'Distributor' },
                  { value: 'org3', label: 'Retailer' },
                ]}
              />
              <AntForm.Item />
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
