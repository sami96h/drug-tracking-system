/* eslint-disable jsx-a11y/media-has-caption */
import { useState, useEffect, FC } from 'react'
import { BrowserQRCodeReader } from '@zxing/library'

const QrScanner:FC = () => {
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader()
    codeReader
      .decodeFromInputVideoDevice(undefined, 'video')
      .then((res) => setResult(res.getText()))
      .catch((err) => console.error(err))
    return () => codeReader.reset()
  }, [])

  return (
    <div>
      <video id="video" style={{ width: 320, height: 240, margin: '30px auto' }} />
      {result ? (
        <p>
          Result:
          {' '}
          {result}
        </p>
      ) : null}
    </div>
  )
}

export default QrScanner
