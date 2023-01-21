import { FC } from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFound:FC = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '50px 0' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button onClick={() => navigate('/')} type="primary">Back Home</Button>}
      />
    </div>
  )
}

export default NotFound
