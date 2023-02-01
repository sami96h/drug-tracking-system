/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import {
  Table, Tag, Select,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  useNavigate,
  useLoaderData,
} from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAssets, deleteAsset, transferAsset } from '../../api/assets'
import './style.css'
import useAuth from '../../hooks/useAuth'

interface DataType {
  id: string;
  medicineName: string;
  owner: string;
}

export async function loader():Promise<any> {
  try {
    const response = await getAssets()
    return response
  } catch (err) {
    return []
  }
}

const BatchesList: FC = () => {
  const navigate = useNavigate()
  const list: any = useLoaderData()
  const data = list.map(({
    batchId, owner, medicineName,
  }: any) => ({
    id: batchId,
    owner,
    medicineName,

  }))

  const { auth } = useAuth()

  const handleDelete = async (batchId: any):Promise<any> => {
    try {
      const response = await deleteAsset(batchId)
      toast.success(`${response.msg}`)
    } catch (err) {
      toast.error('An error occurred during your transaction')
    }
  }

  const handleTransfer = async (batchId:any):Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const response = await transferAsset(batchId)
      toast.success(`${response.msg}`)
    } catch (error) {
      toast.error('An error occurred during your transaction')
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'Id',

    },
    {
      title: 'Medicine Name',
      dataIndex: 'medicineName',
      key: 'medicineName',
    },

    {
      title: 'Stage',
      key: 'owner',
      dataIndex: 'owner',
      render: (_, { owner }) => (
        <Tag
          color={owner === 'Org1MSP' ? 'blue' : owner === 'Org3MSP' ? 'green' : 'yellow'}
          key={owner}
        >
          {
            owner === 'Org1MSP'
              ? 'MANUFACTURING' : owner === 'Org2MSP' ? 'DISTRIBUTING' : 'RETAILER'
}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, { owner, id }) => (
        <Select
          defaultValue="options"
          style={{ width: 120 }}
          onChange={(value) => {
            switch (value) {
              case 'delete': handleDelete(id)
                break
              case 'show details': navigate(`/batches/${id}`)
                break
              case 'update': navigate(`/batches/${id}/update`)
                break
              case 'show history': navigate(`/batches/${id}/history`)
                break
              case 'transfer': handleTransfer(id)
                break
              default:
            }
          }}
          options={[
            auth?.user?.org === 'org1'
              ? { value: 'delete', label: 'Delete', disabled: owner !== 'Org1MSP' }
              : { value: 'update', label: 'update', disabled: auth.user?.org === 'org3' },
            { value: 'show details', label: 'Show details' },
            { value: 'show history', label: 'Show history' },
            {
              value: 'transfer',
              label: 'Transfer',
              disabled: auth?.user?.org === 'org3' || owner === auth.user?.org,
            },

          ]}
        />

      ),
    },
  ]
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default BatchesList
