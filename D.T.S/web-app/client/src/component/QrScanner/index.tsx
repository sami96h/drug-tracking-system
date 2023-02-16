/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useEffect, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, List, Tag } from 'antd'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import QrReader from 'react-qr-scanner'
import { QrScanner } from '@yudiel/react-qr-scanner'

const Qrscanner: FC = () => {
  const [result, setResult] = useState<string | null>(null)
  const navigate = useNavigate()
  const schema = Yup.string().matches(/^[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/, 'Invalid QR Code!')

  useEffect(() => {
    if (result) {
      (async () => {
        try {
          schema.validateSync(result)

          // const exists = await isExist(result)
          //  console.log(exists)
          //  if (!!!exists) {
          navigate(`/boxes/${result}`)
          //  }
        } catch (error: any) {
          toast.error(error.message)
          // console.log(error.message)
        }
      })()
    }
  }, [result])

  // useEffect(() => {
  //   const codeReader = new BrowserQRCodeReader()
  //   codeReader
  //     .decodeFromInputVideoDevice(undefined, 'video')
  //     .then((res) => setResult(res.getText()))
  //     .catch((err) => console.error(err))
  //   return () => codeReader.reset()
  // }, [])
  const reset = (): void => {
    setResult('')
  }

  return (
    <div className="qr-scan-container">
      <h3>Scan The Drug Box</h3>
      <div style={{
        maxWidth: '500px',
        width: '90%',
        margin: '30px auto',
        border: '1px solid #f0f0f0',
        borderRadius: '5px',
      }}
      >

        {/* <QrReader
          delay={1000}
          style={{
            width: 340, height: 260, margin: '10px auto', display: 'block',
          }}
          onError={(er: any) => { console.log(er) }}
          onScan={(value: any) => { setResult(value?.text) }}
        /> */}
        <QrScanner
          onDecode={(res) => setResult(res)}
          onError={(error) => console.log(error?.message)}
        />
        <div
          style={{
            margin: 'auto',
            width: 400,
          }}
        />

        <p>
          <List
            header={<h3>Instructions</h3>}
            bordered
            dataSource={[
              'Position the QR code within the scanner\'s frame for it to automatically detect and scan.',
            ]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </p>

      </div>

    </div>
  )
}

export default Qrscanner
