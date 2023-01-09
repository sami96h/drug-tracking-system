import {
  FC, useState,
} from 'react'
import { Button, QRCode, Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

import './style.css'
import PrepareToPrint from '../PrepareToPrint'

const data = [
  'https://ant.design/1',
  'https://ant.design/2',
  'https://ant.design/3',
  'https://ant.design/4',
  'https://ant.design/5',
]

const QrCodes:FC = () => {
  const [selectToPrint, setSelectToPrint] = useState<string[]>([''])
  const [isModalOpen, setIsModalOpen] = useState(false)

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

        {data.map((ele) => (
          <div className="qr-code">
            <div>
              <QRCode value={ele} />
            </div>
            <p>sami</p>
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
