import React, { FC, useState } from 'react'
import {
  Layout, Menu, theme,
} from 'antd'

import {
  FormOutlined,
  LogoutOutlined,
  HomeOutlined,
  PlusOutlined,
  QrcodeOutlined,
  TableOutlined,
  UserAddOutlined,
} from '@ant-design/icons'

import { useNavigate, Outlet, Link } from 'react-router-dom'
import type { MenuProps } from 'antd'

import './style.css'

const {
  Content, Sider,
} = Layout

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?:Function,
): MenuItem {
  return {
    key,
    icon,
    label,
    onClick,
  } as MenuItem
}

const MainLayout:FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const items: MenuItem[] = [
    getItem(
      'Add Drugs',
      '1',
      <PlusOutlined />,
      () => {
        navigate('/drugs/new')
      },
    ),

    getItem(
      'Update Drugs',
      '2',
      <FormOutlined />,
      () => {
        navigate('/drugs/update')
      },
    ),

    getItem(
      'QR Scan',
      '3',
      <QrcodeOutlined />,
      () => {
        navigate('/qr-scanner')
      },
    ),

    getItem(
      'Batches List',
      '4',
      <TableOutlined />,
      () => {
        navigate('/batches')
      },
    ),
    getItem(
      'Transactions List',
      '5',
      <TableOutlined />,
      () => {
        navigate('/transactions')
      },
    ),

    getItem(
      'Add new User',
      '6',
      <UserAddOutlined />,
      () => {
        navigate('/register')
      },
    ),

    getItem(
      'Logout',
      '7',
      <LogoutOutlined />,
      () => {
        console.log('Logout')
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
          style={{
            margin: 16, background: 'rgba(255, 255, 255, 0.2)', padding: 10, color: '#fff',
          }}
        >
          <Link to="/" replace>samico</Link>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ margin: '40px 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
