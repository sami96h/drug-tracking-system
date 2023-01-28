/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react'

import {
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
} from 'antd'

import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import { updateAsset } from '../../api/assets'

const { RangePicker } = DatePicker
const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }],
}

const UpdateDrugs: FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { id } = useParams()
  const handleUpdate = async (data: any):Promise<void> => {
    const newData = {
      ...data,
      batchId: id,
      receiptDate: data['range-picker'][0].format('YYYY/MM/DD'),
      deliveryDate: data['range-picker'][1].format('YYYY/MM/DD'),
    }

    try {
      const result = await updateAsset(newData)
      toast.success(`${result.msg}`)
      navigate('/transactions')
    } catch (error) {
      toast.error('Error while updating batch')
    }
  }

  return (
    <Form
      className="form-add-drugs"
      form={form}
      name="register"
      onFinish={handleUpdate}
      initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <div className="form-item-container">
        <Form.Item
          name="vehicleId"
          label="Vehicle Id"
          className="form-item"
          rules={[
            {
              required: true,
              message: 'Please input the Vehicle Id',
            },

          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="shipNo"
          label="Ship NO"
          className="form-item"
          rules={[
            {
              required: true,
              message: 'Please input the Ship NO.',
            },

          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="range-picker" {...rangeConfig}>
          <RangePicker placeholder={['Receipt Date', 'Delivery Date']} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sumbit
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

export default UpdateDrugs
