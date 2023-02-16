import { Navigate, Outlet } from 'react-router-dom'
import useAuth from './hooks/useAuth'

export const ProtectedRoutes = ():any => {
  const { auth } = useAuth()
  return (
    auth?.loggedIn ? <Outlet /> : <Navigate to="/login" />
  )
}
