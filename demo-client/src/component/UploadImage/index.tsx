import { Button, Upload } from 'antd'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'

const Uploader:FC<any> = ({ setImageUrl, setFieldValue }) => {
  const [file, setFile] = useState('')

  const beforeUpload = (e:any):boolean => {
    setFile(e)
    return false
  }

  const handleChange = ():void => {
    const data = new FormData()
    if (file) {
      data.append('file', file)
      data.append('upload_preset', `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`)
      data.append('cloud_name', `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`)
      fetch(`${process.env.REACT_APP_CLOUDINARY_BASE_URL}`, {
        method: 'post',
        body: data,
      })
        .then((resp) => resp.json())
        .then((result) => {
          setFieldValue('image', result.url)
        })
        .catch((err) => toast.error(err))
    }
  }

  return (
    <div>
      <Upload
        maxCount={1}
        name="image"
        listType="picture"
        beforeUpload={beforeUpload}
        onChange={() => {
          setImageUrl('')
          handleChange()
        }}
      >
        <Button style={{
          width: '300px',
          display: 'block',
        }}
        >
          Upload Image

        </Button>
      </Upload>
    </div>
  )
}

export default Uploader
