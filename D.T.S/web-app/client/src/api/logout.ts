import axios from './axios'

export const logout = async () => {
  const res = await axios.get('/auth/logout')
  return res.data
}
