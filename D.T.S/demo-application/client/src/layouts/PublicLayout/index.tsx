import React, { useState } from 'react'
import {
  Layout, Menu, theme,
} from 'antd'
import {
  LoginOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import { useNavigate, Outlet, Link } from 'react-router-dom'
import type { MenuProps } from 'antd'
import Logo from '../../assets/image/logo.svg'

const {
  Content, Sider,
} = Layout

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: Function,
): MenuItem {
  return {
    key,
    icon,
    label,
    onClick,
  } as MenuItem
}

const PublicLayout: any = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const items: MenuItem[] = [

    getItem(
      'QR Scan',
      '1',
      <QrcodeOutlined />,
      () => {
        navigate('/qr-scanner')
      },
    ),

    getItem(
      'Login',
      '2',
      <LoginOutlined />,
      () => {
        navigate('/login')
      },
    ),
  ]

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="logo"
        >
          <Link to="/" replace><img src={Logo} alt="" width={100} height={100} /></Link>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['-1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ margin: '0px 16px' }}>
          <div style={{ padding: '0px 4px', minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default PublicLayout
