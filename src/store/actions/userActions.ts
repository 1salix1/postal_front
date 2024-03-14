import { AppDispatch } from '../store'
import { userSlice } from '../reducers/userReducer'
import { UserResponse } from '../../models/user'
import axiosInstance from '../../untils'
import axios, { AxiosError } from 'axios'
import { errorSlice } from '../reducers/errorHandler'

export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const fingerprint = window.navigator.userAgent
    const response = await axiosInstance.post<UserResponse>('/user', {
      login: username,
      password: password,
      fingerprint,
    })
    if (response.data?.status) {
      dispatch(userSlice.actions.setData(response.data.user))
    } else {
      throw response.data.errorMessage
    }
    return true
  } catch (e: AxiosError | unknown) {
    let error = ''
    if (axios.isAxiosError(e)) {
      error = e.message
    } else {
      error = <string>e
    }
    dispatch(userSlice.actions.setData(null))
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    const fingerprint = window.navigator.userAgent
    const response = await axiosInstance.post<UserResponse>('/user/logout', {
      fingerprint,
    })
    dispatch(userSlice.actions.setData(null))
  } catch (e: AxiosError | unknown) {
    let error = ''
    if (axios.isAxiosError(e)) {
      error = e.message
    } else {
      error = <string>e
    }
    dispatch(userSlice.actions.setData(null))
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}

export const getUser = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get<UserResponse>('/user/info')
    if (response.data?.status) {
      dispatch(userSlice.actions.setUser(response.data.user))
    } else {
      throw response.data.errorMessage
    }
    return response.data.user
  } catch (e: AxiosError | unknown) {
    let error = ''
    if (axios.isAxiosError(e)) {
      error = e.message
    } else {
      error = <string>e
    }
    dispatch(userSlice.actions.setData(null))
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}
