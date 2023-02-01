/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Divider,
} from 'antd'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addAsset } from '../../api/assets'
import './style.css'



const { Option } = Select
const { RangePicker } = DatePicker

const drugs = [
  'VOLTAMOL',
  'Paraprofen',
  'Mygesic',
  'Voltamol-K',
  'Cystogen',
  'Ceklar',
  'AzithroMEGA',
  'Hista',

]
const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }],
}
const AddBatch: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values: any):Promise<void> => {
    const productionDate = values['range-picker'][0].format('YYYY/MM/DD')

    const expiryDate = values['range-picker'][1].format('YYYY/MM/DD')
    delete values['range-picker']
    const newValues = { ...values, productionDate, expiryDate }

    try {
      const result = await addAsset(newValues)
      toast.success(`${result.msg}`)
      navigate('/transactions')
    } catch (error) {
      toast.error('Error in submitting transaction')
    }
  }

  const suffixSelector = (
    <Form.Item noStyle>
      <Select style={{ width: 70 }} defaultValue="INS">
        <Option value="USD">$</Option>
        <Option value="INS">₪</Option>
      </Select>
    </Form.Item>
  )

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ maxWidth: 800 }}
      scrollToFirstError
      layout="vertical"
      className="add-batch-container"
    >
      <Divider
        orientation="left"
        style={{
          color: 'rgb(0 21 41)',
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '50px',
        }}
      >
        Add Batch
      </Divider>
      <Form.Item
        name="batchId"
        label="Batch Id"
        className="add-batch-input"
        rules={[
          {
            required: true,
            message: 'Please input the batch id',
          },
          () => ({
            validator(_, value) {
              const regex = /[A-Za-z0-9]+/
              if (regex.test(value)) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('Only numbers and letters are allowd'))
            },
          }),

        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className="add-batch-input"
        name="medicineName"
        label="Medicine Name"
        rules={[
          {
            required: true,
            message: 'Please input medicineName',
          },
        ]}
      >
        <Select
          style={{ width: '100%' }}
            // eslint-disable-next-line max-len
          options={drugs.map((drug:string) => ({ label: drug, value: drug, disabled: !(drug === 'VOLTAMOL' || drug === 'Voltamol-K') }))}
        />
      </Form.Item>

      <Form.Item
        className="add-batch-input"
        name="range-picker"
        label="Production Date / Expiry Date Range"
        {...rangeConfig}
      >
        <RangePicker placeholder={['Production Date', 'Expiry Date']} />
      </Form.Item>

      <Form.Item
        className="add-batch-input"
        name="amount"
        label="Quantity (Boxes)"
        rules={[{ required: true, message: 'Please input the amount of boxes per batch' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        className="add-batch-input"
        name="pricePerBox"
        label="Price / Box"
        rules={[{ required: true, message: 'Please input box price' }]}
      >
        <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '340px',
            marginTop: '29px',
          }}
        >
          Sumbit
        </Button>
      </Form.Item>

    </Form>
  )
}

export default AddBatch
