import { useContext } from 'react'
import { AuthContext } from '../authProvider/AuthProvider'

const useAuth = ():any => useContext(AuthContext)

export default useAuth
