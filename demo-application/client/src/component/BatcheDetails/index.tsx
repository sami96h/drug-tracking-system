/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Typography, Divider, Col, Row, Table, Tag, Dropdown, Button,
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
    console.log('error fetching batch')
  }
}

const BatchesDetails: FC = () => {
  const { auth } = useAuth()
  const {
    batchId,
    medicineName,
    companyName,
    pricePerBox,
    owner,
    productionDate,
    expiryDate,
    description,
    boxes,
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
      <Row>
        <Col span={12}>
          <Typography.Title level={4}>ID:</Typography.Title>
          <Typography.Paragraph>{batchId}</Typography.Paragraph>
          <Typography.Title level={4}>Medicine Name:</Typography.Title>
          <Typography.Paragraph>{medicineName}</Typography.Paragraph>
          <Typography.Title level={4}>Company Name:</Typography.Title>
          <Typography.Paragraph>{companyName}</Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Title level={4}>Description</Typography.Title>
          <Typography.Paragraph>{description}</Typography.Paragraph>
          <Typography.Title level={4}>Price per Box:</Typography.Title>
          <Typography.Paragraph>
            $
            {pricePerBox}
          </Typography.Paragraph>
          <Typography.Title level={4}>Stage:</Typography.Title>
          <Typography.Paragraph>{owner === 'Org1MSP' ? 'Manufacturing' : owner === 'Org2MSP' ? 'DISTRIBUTING' : 'Retailer'}</Typography.Paragraph>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={12}>
          <Typography.Title level={4}>production Date:</Typography.Title>
          <Typography.Paragraph>{productionDate}</Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Title level={4}>Expiry Date:</Typography.Title>
          <Typography.Paragraph>{expiryDate}</Typography.Paragraph>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={12}>
          <Typography.Title level={4}>Boxes Per Batch:</Typography.Title>
          <Divider />
          <Typography.Paragraph>
            <Table columns={columns} dataSource={boxes} />
          </Typography.Paragraph>
        </Col>

      </Row>

    </div>
  )
}

export default BatchesDetails
