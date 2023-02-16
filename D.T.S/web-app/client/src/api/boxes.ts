import axios from './axios'

export const getBoxes = async (batchId:any):Promise<any> => {
  const res = await axios.get(`/assets/${batchId}/boxes`)
  return res.data
}

export const getBox = async (boxId:any):Promise<any> => {
  const res = await axios.get(`/boxes/${boxId}`)
  console.log(res)
  return res.data
}

export const sellBox = async (boxId:any):Promise<any> => {
  const res = await axios.patch('/assets', boxId)
  return res.data
}
