import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: { 'X-API-Key': '3b6efb6f-29fe-418a-a2fc-253cc9d203a5' },
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

export default instance
