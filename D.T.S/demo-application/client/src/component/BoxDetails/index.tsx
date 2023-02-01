/* eslint-disable max-len */
import React from 'react'
import {
  Descriptions, Empty, Button, Divider, Tag,
} from 'antd'
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
    return { response }
  } catch (error: any) {
    return { message: 'Internal Server Error' }
  }
}
const BoxDetails: React.FC = () => {
  const handleSell = async (id:any):Promise<any> => {
    try {
      const response = await sellBox({ boxId: id })
      toast.success(`${response.msg}`)
    } catch (error) {
      toast.error('Internal server error')
    }
  }

  const { response, message }: any = useLoaderData()
  const { auth } = useAuth()
  if (!response) {
    toast.error(message)
    return <Empty />
  }
  const {
    id,
    batchId,
    Dosage,
    medicineName,
    Contraindications,
    Description,
    productionDate,
    expiryDate,
    Company,
    Warnings,
    price,
    Indications,
    Storage, Packing,
    Composition,
    'Side Effects': sideEffects, owner,
    sold,
    DistributorData,
  } = response.data

  return (

    <div>

      <Descriptions
        title="Box Details"
        bordered
        column={{
          xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1,
        }}
      >
        <Descriptions.Item label="Box Id">{id}</Descriptions.Item>
        <Descriptions.Item label="Batch Id">{batchId}</Descriptions.Item>
        <Descriptions.Item label="Medicine Name">{medicineName}</Descriptions.Item>
        <Descriptions.Item label="Price">{price}</Descriptions.Item>
        <Descriptions.Item label="Company Name">{Company}</Descriptions.Item>
        <Descriptions.Item label="Stage">{owner === 'Org1MSP' ? 'Manufacturing' : owner === 'Org2MSP' ? 'DISTRIBUTING' : 'Retailer'}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={sold ? 'red' : 'green'}>
            {sold ? 'Out Of Stock' : 'In stock'}
          </Tag>

        </Descriptions.Item>
        <Descriptions.Item label="Production Date">{productionDate}</Descriptions.Item>
        <Descriptions.Item label="Expiry Date">{expiryDate}</Descriptions.Item>
        <Descriptions.Item label="Description" span={3}>
          {Description}
        </Descriptions.Item>
        <Descriptions.Item label="Storage" span={3}>
          {Storage}
        </Descriptions.Item>

        <Descriptions.Item label="Packing" span={3}>
          {Packing}
        </Descriptions.Item>

        <Descriptions.Item label="Indications" span={3}>
          {Indications}
        </Descriptions.Item>

        <Descriptions.Item label="Dosage" span={3}>
          {Dosage}
        </Descriptions.Item>

        <Descriptions.Item label="Contraindications" span={3}>
          {Contraindications}
        </Descriptions.Item>
        <Descriptions.Item label="Composition" span={3}>
          {Composition}
        </Descriptions.Item>

        <Descriptions.Item label="Warnings" span={3}>
          {Warnings}
        </Descriptions.Item>

        <Descriptions.Item label="Side Effects" span={3}>
          {sideEffects}
        </Descriptions.Item>

      </Descriptions>
      <Divider
        orientation="left"
        style={{
          color: 'rgb(0 21 41)',
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '50px',
          marginTop: '25px',
        }}
      />

      {DistributorData ? (
        <>

          <Divider
            orientation="left"
            style={{
              color: 'rgb(0 21 41)',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '50px',
              marginTop: '25px',
            }}
          >
            Distributor Data

          </Divider>

          <Descriptions
            bordered
            layout="vertical"
          >
            <Descriptions.Item label="Vehicle Id" span={2}>{DistributorData.vehicleId}</Descriptions.Item>
            <Descriptions.Item label="Ship NO." span={2}>{DistributorData.shipNo}</Descriptions.Item>
            <Descriptions.Item label="Receipt Date">{DistributorData.receiptDate}</Descriptions.Item>
            <Descriptions.Item label="Delivery Date">{DistributorData.deliveryDate}</Descriptions.Item>
          </Descriptions>
        </>
      ) : ''}
      {' '}
      <Divider />

      {
        auth.user?.org === 'org3' && (
        <Button
          disabled={!(owner === 'Org3MSP' && !sold)}
          style={{

            width: '120px',
            margin: '10px auto',
          }}
          onClick={() => (handleSell(id))}
          type="primary"
        >
          Sell
        </Button>
        )

      }

    </div>
  )
}

export default BoxDetails
