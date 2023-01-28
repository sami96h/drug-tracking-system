import { FC } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'

type Props = {
    children?: JSX.Element;
  };

export const ProtectedRoutes = ({ children }: Props) => {
  const { auth } = useAuth()
  return (
    <>{auth?.loggedIn ? children : <Navigate to="/login" />}</>
  )
}
