import { FC } from 'react'
import {
  Button, Layout, theme,
} from 'antd'
import { Header, Content } from 'antd/es/layout/layout'
import { Outlet } from 'react-router-dom'
import './style.css'

const MainLayout:FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo">Samico</div>
        <div>
          <Button
            type="primary"
            style={{ color: 'rgb(242, 242, 242)' }}
          >
            Add Drug
          </Button>
          <Button>QR Scan</Button>
          <Button>Drug List</Button>
        </div>

      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div
          className="site-layout-content"
          style={{ background: colorBgContainer }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}

export default MainLayout
