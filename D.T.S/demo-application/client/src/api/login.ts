import axios from './axios'

export const login = async (credentials:any):Promise<any> => {
  const res = await axios.post('/auth/login', credentials)
  return res.data
}
