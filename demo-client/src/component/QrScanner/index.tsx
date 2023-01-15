/* eslint-disable max-len */
/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useEffect, FC } from 'react'
import { BrowserQRCodeReader } from '@zxing/library'
import { Button, List, Tag } from 'antd'

import './style.css'
import { useNavigate } from 'react-router-dom'

const QrScanner:FC = () => {
  const [result, setResult] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader()
    codeReader
      .decodeFromInputVideoDevice(undefined, 'video')
      .then((res) => setResult(res.getText()))
      .catch((err) => console.error(err))
    return () => codeReader.reset()
  }, [])

  const reset = ():void => {
    setResult('')
  }
  useEffect(() => {
    if (result) {
      navigate(`/batches/${result}`)
    }
  }, [result])

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
        <video
          id="video"
          style={{
            width: 340, height: 260, margin: '10px auto', display: 'block',
          }}
        />
        {
            result
              ? (
                <div style={{ width: '70%', margin: '10px auto' }}>
                  <p style={{ margin: '10px 0' }}>
                    <Tag color="green">
                      Result:
                    </Tag>
                    {' '}
                    {result}
                  </p>
                  <div className="btn-container">
                    <Button onClick={reset}>reset</Button>
                    <Button type="primary" onClick={reset}>Show Details</Button>
                  </div>
                </div>
              )
              : (
                <p>
                  <List
                    header={<h3>Instructions</h3>}
                    bordered
                    dataSource={[
                      'Make sure that your device has a camera. Some devices, such as older laptops or desktops, may not have a built-in camera.',
                      'Allow access to your device\'s camera when prompted by the browser. The scanner will not work if you do not grant access to the camera.',
                      'Position the QR code within the frame of the scanner. The scanner will automatically detect the QR code and scan it.',
                    ]}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </p>
              )
          }

      </div>

    </div>
  )
}

export default QrScanner
