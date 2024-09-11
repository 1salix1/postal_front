import axios from 'axios'
import Cookies from 'js-cookie'
import { addNotification } from 'store/reducers/notificationHandler'
import { useAppDispatch } from 'hooks/redux'

const axiosInstance = axios.create({
  baseURL: 'https://www.xn--e1aujn3b.xn--p1ai/backend',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
const axiosInstanceToken = axios.create({
  baseURL: 'https://www.xn--e1aujn3b.xn--p1ai/backend',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
interface RefreshTokenResponse {
  token: string
  refreshToken: string
}
const refreshTheToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken')
    if (!refreshToken) {
      window.location.href = '/login'
      return null
    }
    const response = await axiosInstanceToken.post<RefreshTokenResponse>('/user/refreshToken', {
      refreshToken,
      fingerprint: window.navigator.userAgent,
    })
    if (response.data) {
      const date = new Date()
      date.setHours(date.getHours() + 1)
      Cookies.set('refreshToken', response.data.refreshToken, {
        secure: false,
        sameSite: 'strict',
        expires: 30,
        path: '/',
      })

      Cookies.set('accessToken', response.data.token, {
        secure: false,
        sameSite: 'strict',
        expires: date,
        path: '/',
      })
      return response.data.token
    } else {
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
      throw 'Не авторизован'
    }
  } catch (err) {
    window.location.href = '/login'
  }
}
// Add a request interceptor to add the JWT token to the authorization header
axiosInstance.interceptors.request.use(
  config => {
    const accessToken = Cookies.get('accessToken')
    if (accessToken) {
      config.headers.apiKey = accessToken
    }
    return config
  },
  error => Promise.reject(error),
)

// Add a response interceptor to refresh the JWT token if it's expired
axiosInstance.interceptors.response.use(
  async response => {
    return response
  },
  async error => {
    const originalRequest = error.config

    // If the error is a 401 and we have a refresh token, refresh the JWT token
    if (error.response.status === 401) {
      originalRequest.headers.retry = true
      const accessToken = await refreshTheToken()
      // Re-run the original request that was intercepted
      originalRequest.headers.apiKey = accessToken
      return axiosInstance(originalRequest)
    }
    if (error.response?.data) error.message = error.response.data
    // Return the original error if we can't handle it
    return Promise.reject(error)
  },
)

export default axiosInstance
