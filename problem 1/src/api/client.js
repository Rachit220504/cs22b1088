import axios from 'axios'

// Create an axios instance with the base URL for the API
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message)
    return Promise.reject(error)
  }
)

export default apiClient