import axios from './axios'

export const addAsset = async (data: any) => {
  const res = await axios.post('/assets', data)
  return res.data
}

export const getAssets = async () => {
  const res = await axios.get('/assets')
  return res.data.data
}

export const getAsset = async (batchId: any) => {
  const res = await axios.get(`/assets/${batchId}`)
  return res.data.data
}

export const isExist = async (batchId: any) => {
  const res = await axios.get(`/assets/${batchId}/exists`)
  return res.data.data
}

export const deleteAsset = async (batchId: any) => {
  const res = await axios.delete(`/assets/${batchId}`)
  return res.data
}

export const updateAsset = async (data: any) => {
  const res = await axios.patch('/assets', data)
  return res.data
}

export const transferAsset = async (batchId:any) => {
  const res = await axios.patch('/assets', { batchId })
  return res.data
}
