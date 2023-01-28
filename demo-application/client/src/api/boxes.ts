import axios from './axios'

export const getBoxes = async (batchId:any) => {
  const res = await axios.get(`/assets/${batchId}/boxes`)
  return res.data
}

export const getBox = async (boxId:any) => {
  const res = await axios.get(`/boxes/${boxId}`)
  return res.data
}

export const sellBox = async (boxId:any) => {
  const res = await axios.patch('/assets', boxId)
  return res.data
}
