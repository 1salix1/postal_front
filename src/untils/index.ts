import axios from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:4445',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
const axiosInstanceToken = axios.create({
  baseURL: 'http://127.0.0.1:4445',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
interface IRefreshTokenResponseSuccess {
  status: true
  token: string
  refreshToken: string
}
interface IRefreshTokenResponseFailed {
  status: false
  errorMessage: string
}
type RefreshTokenResponse = IRefreshTokenResponseSuccess | IRefreshTokenResponseFailed

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
    if (response.data?.status) {
      const date = new Date()
      date.setHours(date.getHours() + 1)
      Cookies.set('refreshToken', response.data.refreshToken, {
        secure: true,
        sameSite: 'strict',
        expires: 30,
        path: '/',
      })

      Cookies.set('accessToken', response.data.token, {
        secure: true,
        sameSite: 'strict',
        expires: date,
        path: '/',
      })
      return response.data.token
    } else {
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
      throw response.data.errorMessage
    }
  } catch (err) {
    console.log(err)
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
    const originalRequest = response.config
    if (response.data.status === false && response.data.errorMessage === 'Unauthorised') {
      const accessToken = await refreshTheToken()
      // Re-run the original request that was intercepted
      originalRequest.headers.apiKey = accessToken
      return axiosInstance(originalRequest)
    }
    return response
  },
  async error => {
    const originalRequest = error.config

    // If the error is a 401 and we have a refresh token, refresh the JWT token
    if (error.response.status === false && error.response.errorMessage === 'Unauthorised') {
      originalRequest.headers.retry = true
      const accessToken = await refreshTheToken()
      // Re-run the original request that was intercepted
      originalRequest.headers.apiKey = accessToken
      return axiosInstance(originalRequest)
    }

    // Return the original error if we can't handle it
    return Promise.reject(error)
  },
)

export default axiosInstance
