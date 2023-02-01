/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Table, Tag, Button, Descriptions, Divider,
} from 'antd'
import { FC } from 'react'
import {
  useLoaderData,
} from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { toast } from 'react-toastify'
import { sellBox } from '../../api/boxes'
import { getAsset } from '../../api/assets'
import useAuth from '../../hooks/useAuth'

interface DataType {
  id: string;
  sold: boolean;

}

const handleSell = async (id:any) => {
  try {
    const response = await sellBox({ boxId: id })
    toast.success(`${response.msg}`)
  } catch (error) {
    toast.error('Internal server error')
  }
}

export async function loader({ params: { id } }: any) {
  try {
    const response = await getAsset(id)
    return response
  } catch (error) {
    toast.error('Internal server error')
  }
}

const BatchesDetails: FC = () => {
  const { auth } = useAuth()
  const {
    batchId,
    medicineName,
    Company,
    pricePerBox,
    owner,
    productionDate,
    expiryDate,
    Description,
    boxes,
    Storage,
    Packing,
    Indications,
    Dosage,
    Contraindications,
    Composition,
    Warnings,
    DistributorData,
    'Side Effects': sideEffects,
  } :any = useLoaderData()

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',

    },

    {
      title: 'Status',
      key: 'sold',
      dataIndex: 'sold',
      render: (_, { sold, id }) => (
        <Tag color={sold ? 'red' : 'green'} key={id}>
          {sold ? 'Out Of Stock' : 'In stock'}
        </Tag>
      ),
    },
    auth.user?.org === 'org3' ? {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id, sold }) => (
        <Button
          onClick={() => (handleSell(id))}
          disabled={sold}

        >
          Sell
        </Button>
      ),
    } : {},

  ]

  return (
    <div>

      <Descriptions
        bordered
        title="Batch Details"
        layout="vertical"
      >
        <Descriptions.Item label="Batch Id" span={1}>{batchId}</Descriptions.Item>
        <Descriptions.Item label="Medicine Name">{medicineName}</Descriptions.Item>
        <Descriptions.Item label="Company Name">{Company}</Descriptions.Item>
        <Descriptions.Item label="Stage">{owner === 'Org1MSP' ? 'Manufacturing' : owner === 'Org2MSP' ? 'DISTRIBUTING' : 'Retailer'}</Descriptions.Item>
        <Descriptions.Item label="Expiry Date" span={1}>{expiryDate}</Descriptions.Item>
        <Descriptions.Item label="Production Date" span={1}>{productionDate}</Descriptions.Item>
        <Descriptions.Item label="Price Per Box">

          {pricePerBox}
        </Descriptions.Item>
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
      <Table
        columns={columns}
        dataSource={boxes}
        style={{
          marginTop: '25px',
        }}
      />

    </div>
  )
}

export default BatchesDetails
