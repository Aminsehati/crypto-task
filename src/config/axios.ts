import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'X-CMC_PRO_API_KEY': '8402ff41-c276-40ba-898b-bf3577908c61',
  },
})

export default axiosInstance
