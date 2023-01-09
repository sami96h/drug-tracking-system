/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import {
  Button, Table, Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'

import './style.css'

interface DataType {
  id: string;
  medicineName:string;
  companyName:string;
  numberOfBoxes: number;
  pricePerBox: number;
  stage:string;
  productionDate:string
  expiryDate:string;
}

const data: DataType[] = [
  {
    id: '1',
    medicineName: 'medicineName',
    companyName: 'companyName',
    numberOfBoxes: 30,
    pricePerBox: 50,
    stage: 'stage',
    productionDate: '12/7/2012',
    expiryDate: '13/55/1520',
  },
  {
    id: '2',
    medicineName: 'medicineName',
    companyName: 'companyName',
    numberOfBoxes: 30,
    pricePerBox: 50,
    stage: 'stage',
    productionDate: '12/7/2012',
    expiryDate: '13/55/1520',
  },
  {
    id: '3',
    medicineName: 'medicineName',
    companyName: 'companyName',
    numberOfBoxes: 30,
    pricePerBox: 50,
    stage: 'stage',
    productionDate: '12/7/2012',
    expiryDate: '13/55/1520',
  },
]

const BatchesList:FC = () => {
  const navigate = useNavigate()
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'Id',
      render: (Id) => <a>{Id}</a>,
    },
    {
      title: 'Medicine Name',
      dataIndex: 'medicineName',
      key: 'medicineName',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Number of Boxes',
      dataIndex: 'companyName',
      key: 'companyName',
    },

    {
      title: 'Price Per Box',
      dataIndex: 'pricePerBox',
      key: 'pricePerBox',
    },

    {
      title: 'Stage',
      key: 'stage',
      dataIndex: 'stage',
      render: (_, { stage }) => (
        <Tag color="red" key={stage}>
          {stage.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Production Date',
      dataIndex: 'productionDate',
      key: 'productionDate',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'id',
      render: (id) => (
        <Button
          onClick={() => navigate(`/batches/${id}`)}
        >
          Show Details
        </Button>
      ),
    },
  ]

  return (
    <div>
      TransactionsList
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default BatchesList
