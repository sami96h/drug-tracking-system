import axios from './axios'

export const getTransactions = async () => {
  const res = await axios.get('/transactions')
  return res
}
