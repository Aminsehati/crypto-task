import axios from 'axios'

const API_BASE = import.meta.env.DEV
  ? '/api'
  : 'https://pro-api.coinmarketcap.com/v1'

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'X-CMC_PRO_API_KEY': '8402ff41-c276-40ba-898b-bf3577908c61',
  },
})

export default axiosInstance
