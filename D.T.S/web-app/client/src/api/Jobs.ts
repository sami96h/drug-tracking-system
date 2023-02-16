import axios from './axios'

export const getJob = async (jobId:any):Promise<any> => {
  const res = await axios.get(`/jobs/${jobId}`)
  return res.data
}
