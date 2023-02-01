/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import {
  Button, Popover, Table, Tag,
} from 'antd'
import { useNavigate, useLoaderData } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import './style.css'

import { getTransactions } from '../../api/transactions'

interface DataType {
  id: string;
  name: string;
  batchId: string;
  status: string;
  action: string;
  error: string;
  transactionName:string;

}

// eslint-disable-next-line consistent-return
export async function loader():Promise<any> {
  try {
    const response = await getTransactions()

    if (response.status === 200) {
      if (response.data.msg) {
        return []
      }
      return response.data
    }
  } catch (err) {
    return []
  }
}

const TransactionsList:FC = () => {
  const transactions :any = useLoaderData()
  const navigate = useNavigate()
  const columns: ColumnsType<DataType> = [
    {
      title: 'Transaction Id',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Transaction Name',
      dataIndex: 'transactionName',
      key: 'transactionName',

    },
    {
      title: 'Batch Id',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'Status',
      render: (_, { status }) => (
        // eslint-disable-next-line max-len
        <Tag color={status === 'valid' ? 'green' : status === 'invalid' ? 'red' : 'blue'} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, {
        status, batchId, error, transactionName,
      }) => {
        if (status === 'invalid'
        ) {
          return (
            <Popover content={error} trigger="hover">
              <Button>Show Error</Button>
            </Popover>
          )
        }
        return (
          <Button
            disabled={!(transactionName === 'createBatch' && status === 'valid')}
            onClick={() => navigate(`/qr-codes/${batchId}`)}
          >
            Generate QR
          </Button>
        )
      },
    },
  ]

  return (

    <Table columns={columns} dataSource={transactions} />

  )
}

export default TransactionsList
