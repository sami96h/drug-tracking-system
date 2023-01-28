import {
  FC, useState,
} from 'react'
import { Button, QRCode, Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useLoaderData } from 'react-router-dom'
import './style.css'
import PrepareToPrint from '../PrepareToPrint'
import { getBoxes } from '../../api/boxes'

// const data = [
//   'https://ant.design/1',
//   'https://ant.design/2',
//   'https://ant.design/3',
//   'https://ant.design/4',
//   'https://ant.design/5',
// ]

export const loader = async ({ params: { id } }:any) => {
  const response = await getBoxes(id)
  return response
}

const QrCodes:FC = () => {
  const [selectToPrint, setSelectToPrint] = useState<string[]>([''])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const data :any = useLoaderData()
  const showModal = ():void => {
    setIsModalOpen(true)
  }
  const onChange = (e: CheckboxChangeEvent, value:string):void => {
    if (e.target.checked === true) {
      setSelectToPrint((prev) => [...prev, value])
    }
  }

  const handlePrintAll = ():void => {
    setSelectToPrint(data)
  }

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '90%',
        margin: '0px auto',
        paddingTop: '30px',
      }}
      >
        <h2>QR Codes</h2>
        <div>

          <Button
            onClick={showModal}
            style={{ margin: '0 10px ' }}
          >
            Print Selected
          </Button>

          <Button
            type="primary"
            onClick={() => {
              handlePrintAll()
              showModal()
            }}
          >
            Print All
          </Button>

        </div>
      </div>
      <div className="qr-codes-container">

        {data.data.map((ele:any) => (
          <div className="qr-code">
            <div>
              <QRCode value={ele.id} />
            </div>
            <p>{ele.id}</p>
            <Checkbox onChange={(e) => onChange(e, ele)}>select to print</Checkbox>
          </div>

        ))}

      </div>
      <PrepareToPrint
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectToPrint={selectToPrint}
        setSelectToPrint={setSelectToPrint}
      />
    </div>
  )
}

export default QrCodes
