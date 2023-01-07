import { FC } from 'react'
import {
  Button, Layout, theme,
} from 'antd'
import { Header, Content } from 'antd/es/layout/layout'
import { useNavigate, Outlet } from 'react-router-dom'
import './style.css'

const MainLayout:FC = () => {
  const navigate = useNavigate()

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
            onClick={(() => navigate('/drugs/new'))}
          >
            Add Drug
          </Button>

          <Button
            onClick={(() => navigate('/drugs/update'))}
          >
            Update Drug
          </Button>
          <Button
            onClick={(() => navigate('/qr-scanner'))}

          >
            QR Scan

          </Button>
          <Button>Transactions List</Button>
          <Button
            onClick={(() => navigate('/transactions'))}

          >
            Transactions List
          </Button>
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
