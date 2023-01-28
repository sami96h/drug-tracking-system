import React from 'react'
import {
  Button,
  Form,
  Input,

} from 'antd'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { addAsset } from '../../api/assets'

const AddDrug: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values: any):Promise<void> => {
    const productionDate = moment(values.productionDate).format('YYYY/MM/DD')
    const expiryDate = moment(values.expiryDate).format('YYYY/MM/DD')
    const newValues = { ...values, productionDate, expiryDate }
    try {
      const result = await addAsset(newValues)
      toast.success(`${result.msg}`)
      navigate('/transactions')
    } catch (error) {
      toast.error('Error in submitting transaction')
    }
  }

  return (
    <Form
      className="form-add-drugs"
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <div className="form-item-container">

        <Form.Item
          name="medicineName"
          label="Medicine Name"
          className="form-item"
          rules={[
            {
              required: true,
              message: 'Please input medicineName',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="companyName"
          label="Company Name"
          className="form-item"
          rules={[{ required: true, message: 'Please input the company name', whitespace: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="packing"
          label="Packing"
          rules={[{ required: true, message: 'Please input the packing info' }]}
          className="form-item"
        >
          <Input.TextArea showCount maxLength={300} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the drug description' }]}
          className="form-item"
        >
          <Input.TextArea showCount maxLength={300} />
        </Form.Item>
        <Form.Item
          name="dosage"
          label="Dosage"
          rules={[{ required: true, message: 'Please input the drug Dosage' }]}
          className="form-item"
        >
          <Input.TextArea showCount maxLength={300} />
        </Form.Item>
        <Form.Item
          name="composition"
          label="Composition"
          rules={[{ required: true, message: 'Please input the drug composition' }]}
          className="form-item"
        >
          <Input.TextArea showCount maxLength={300} />
        </Form.Item>
        <Form.Item
          name="warnings"
          label="Warnings"
          className="form-item"
          rules={[{ required: true, message: 'Please input the drug warnings' }]}
        >
          <Input.TextArea
            showCount
            maxLength={300}
            placeholder="Information about potential side effects or risks associated
            with taking the drug."
          />
        </Form.Item>

        <Form.Item
          name="contraindications"
          label="Contraindications"
          rules={[{ required: true, message: 'Please input the drug contraindications' }]}
          className="form-item"
        >
          <Input.TextArea
            showCount
            maxLength={300}
            placeholder="Medical conditions or other factors that
            would make the drug unsafe to use."
          />
        </Form.Item>

        <Form.Item
          name="storage"
          label="Storage"
          rules={[{ required: true, message: 'Please input the storage instructions' }]}
          className="form-item"
        >
          <Input.TextArea
            showCount
            maxLength={300}
            placeholder=" Information about how the drug should be stored,
             such as temperature or light requirements."
          />
        </Form.Item>

        <Form.Item
          name="indications"
          label="Indications"
          className="form-item"
          rules={[{ required: true, message: 'Please input the drug indications' }]}
        >
          <Input.TextArea
            showCount
            maxLength={300}
            placeholder="The medical conditions or symptoms that the drug is used to treat."
          />
        </Form.Item>
        <Form.Item
          name="sideEffects"
          label="Side Effects"
          className="form-item"
          rules={[{ required: true, message: 'Please input the drug side effects' }]}
        >
          <Input.TextArea
            showCount
            maxLength={300}

          />
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

export default AddDrug
