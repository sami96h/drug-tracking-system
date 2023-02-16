import axios from './axios'

export const addAsset = async (data: any):Promise<any> => {
  const res = await axios.post('/assets', data)
  return res.data
}

export const getAssets = async ():Promise<any> => {
  const res = await axios.get('/assets')
  return res.data.data
}

export const getAsset = async (batchId: any):Promise<any> => {
  const res = await axios.get(`/assets/${batchId}`)
  return res.data.data
}

export const isExist = async (batchId: any):Promise<any> => {
  const res = await axios.get(`/assets/${batchId}/exists`)
  return res.data.data
}

export const deleteAsset = async (batchId: any):Promise<any> => {
  const res = await axios.delete(`/assets/${batchId}`)
  return res.data
}

export const updateAsset = async (data: any) :Promise<any> => {
  const res = await axios.patch('/assets', data)
  return res.data
}

export const transferAsset = async (batchId:any):Promise<any> => {
  const res = await axios.patch('/assets', { batchId })
  return res.data
}
