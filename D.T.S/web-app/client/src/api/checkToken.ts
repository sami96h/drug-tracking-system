import axios from './axios'

export const checkToken = async () => {
  const res = await axios.post('/auth/token')
  return res.data
}
