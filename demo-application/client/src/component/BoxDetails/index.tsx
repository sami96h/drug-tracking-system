import React from 'react'
import { Descriptions, Empty, Button } from 'antd'
import {
  useLoaderData,
} from 'react-router-dom'
import { toast } from 'react-toastify'
import { getBox, sellBox } from '../../api/boxes'
import useAuth from '../../hooks/useAuth'

export async function loader({ params: { id } }: any) :Promise<any> {
  try {
    const response = await getBox(id)
    if (response.message) {
      return response
    }
    const data = { ...response.data, boxId: id }
    return { data }
  } catch (error: any) {
    return { message: 'Internal Server Error' }
  }
}
const BoxDetails: React.FC = () => {
  const handleSell = async (id:any) => {
    try {
      const response = await sellBox({ boxId: id })
      toast.success(`${response.msg}`)
    } catch (error) {
      console.log(error)
      toast.error('Internal server error')
    }
  }

  const { data, message }: any = useLoaderData()
  const { auth } = useAuth()
  if (!data) {
    toast.error(message)
    return <Empty />
  }

  const {
    boxId,
    batchId,
    stage,
    medicineName,
    description,
    productionDate,
    expiryDate,
    companyName,
    price,
  } = data

  return (

    <div>
      <Descriptions
        title="Box Details"
        bordered
        column={{
          xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1,
        }}
      >
        <Descriptions.Item label="Box Id">{boxId}</Descriptions.Item>
        <Descriptions.Item label="Batch Id">{batchId}</Descriptions.Item>
        <Descriptions.Item label="Medicine Name">{medicineName}</Descriptions.Item>
        <Descriptions.Item label="Price">{price}</Descriptions.Item>
        <Descriptions.Item label="Company Name">{companyName}</Descriptions.Item>
        <Descriptions.Item label="Stage">{stage}</Descriptions.Item>
        <Descriptions.Item label="description" span={3}>
          {description}
        </Descriptions.Item>
        <Descriptions.Item label="Production Date">{productionDate}</Descriptions.Item>
        <Descriptions.Item label="Expiry Date">{expiryDate}</Descriptions.Item>
      </Descriptions>

      <Button
        disabled={auth.user?.org !== 'org3'}
        onClick={() => (handleSell(boxId))}
        type="primary"
      >
        Sell
      </Button>

    </div>
  )
}

export default BoxDetails
