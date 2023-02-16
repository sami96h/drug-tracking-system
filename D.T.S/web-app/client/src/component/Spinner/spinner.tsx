import React from 'react'
import { Space, Spin } from 'antd'

const Spinner: React.FC = () => (
  <div>
    <Space
      direction="vertical"
      style={{
        margin: '250px auto',
        width: 'max-content',

        display: 'block',
      }}
    >
      <Space>

        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </Space>

    </Space>
  </div>

)

export default Spinner
