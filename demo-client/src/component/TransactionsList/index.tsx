/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import {
  Button, Popover, Table, Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid' //

import './style.css'

interface DataType {
  id: string;
  name: string;
  batchId: string;
  status: string;
  action: string;
}

const TransactionsList:FC = () => {
  const navigate = useNavigate()
  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'Id',
      render: (Id) => <a>{Id}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Batch Id',
      dataIndex: 'batchId',
      key: 'BatchId',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'Status',
      render: (_, { status }) => (
        <Tag
          color="red"
          key={uuidv4()}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, { action }) => {
        if (action === 'invalid'
        ) {
          return (
            <Popover
              key={uuidv4()}
              content={action}
              title="Title"
              trigger="hover"
            >
              <Button>Hover me</Button>
            </Popover>
          )
        }
        return (
          <Button
            onClick={() => navigate('/qr-codes')}
            key={uuidv4()}
          >
            Generate QR
          </Button>
        )
      },
    },
  ]

  const data: DataType[] = [
    {
      id: '1',
      name: 'John Brown',
      batchId: '32',
      status: 'developer',
      action: 'invalid',

    },
    {
      id: '2',
      name: 'Jim Green',
      batchId: '42',
      status: 'loser',
      action: 'action',
    },
    {
      id: '3',
      name: 'Joe Black',
      batchId: '32',
      status: 'teacher',
      action: 'action',
    },
  ]
  return (
    <div>
      TransactionsList
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default TransactionsList
