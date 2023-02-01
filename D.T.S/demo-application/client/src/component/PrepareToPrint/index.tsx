import { FC, useRef } from 'react'
import { Modal, QRCode } from 'antd'
import './style.css'
import { useReactToPrint } from 'react-to-print'

interface IPrepareToPrint{
  isModalOpen:boolean;
  setIsModalOpen:Function;
  setSelectToPrint:Function;
  selectToPrint:string[];
}

const PrepareToPrint:FC<IPrepareToPrint> = ({
  isModalOpen, setIsModalOpen, selectToPrint, setSelectToPrint,
}) => {
  const printRef = useRef<any>()

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  const handleCancel = ():void => {
    setSelectToPrint([])
    setIsModalOpen(false)
  }

  return (
    <div>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handlePrint} onCancel={handleCancel}>
        <div ref={printRef} className="qr-codes-container">
          {selectToPrint.map((ele:string) => (
            <div className="qr-code">
              <QRCode value={ele} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default PrepareToPrint
