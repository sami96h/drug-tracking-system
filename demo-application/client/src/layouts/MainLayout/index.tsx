import React, { FC, useState, useEffect } from 'react'
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
import { toast } from 'react-toastify'
import { logout } from '../../api/logout'
import useAuth from '../../hooks/useAuth'
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

const MainLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const { auth, dispatch } = useAuth()

  useEffect(
    () => {
      if (!auth.loggedIn) {
        navigate('/')
      }
    },
    [auth.loggedIn],
  )

  const handleLogOut = async () :Promise<void> => {
    try {
      await logout()
      dispatch?.({
        type: 'LOGOUT',
      })
    } catch (error) {
      toast.error('Internal Server Error')
    }
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const items: MenuItem[] = [
    auth.user?.org === 'org1' ? getItem(
      'Add Batch',
      '1',
      <PlusOutlined />,
      () => {
        navigate('/batches/new')
      },
    ) : null,
    getItem(
      'Add Drug',
      '2',
      <PlusOutlined />,
      () => {
        navigate('/drugs/new')
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
      'Logout',
      '6',
      <LogoutOutlined />,
      () => {
        handleLogOut()
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
