import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IUser, IUserState } from '../../models/user'
import Cookies from 'js-cookie'
import axiosInstance from '../../untils'
import { AxiosResponse } from 'axios'
const userState: IUserState = {
  name: null,
  loading: false,
  error: null,
}
export const login = createAsyncThunk<IUser, { login: string; password: string }, { rejectValue: void }>(
  'login',
  async ({ login, password }) => {
    const fingerprint = window.navigator.userAgent
    const response = await axiosInstance.post<void, AxiosResponse<IUser>>(`/user`, {
      login,
      password,
      fingerprint,
    })
    return response.data
  },
)
export const logout = createAsyncThunk<boolean, void>('logout', async () => {
  const fingerprint = window.navigator.userAgent
  const response = await axiosInstance.post<void, AxiosResponse<boolean>>(`/user/logout`, {
    fingerprint,
  })
  return response.data
})
export const getUser = createAsyncThunk<IUser, void>('getUser', async () => {
  const response = await axiosInstance.get<void, AxiosResponse<IUser>>(`/user/info`)
  return response.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    setUser(state, action) {
      if (action.payload?.name) {
        state.name = action.payload.name
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.name = action.payload.name
      state.loading = false
      state.error = null
      const date = new Date()
      date.setHours(date.getHours() + 1)
      Cookies.set('refreshToken', action.payload.refreshToken, {
        secure: false,
        sameSite: 'strict',
        expires: 30,
        path: '/',
      })

      Cookies.set('accessToken', action.payload.token, {
        secure: false,
        sameSite: 'strict',
        expires: date,
        path: '/',
      })
    })
    builder.addCase(login.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.loading = false
      state.name = null
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
    })
    builder.addCase(logout.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.loading = false
      state.name = null
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
    })
    builder.addCase(logout.fulfilled, state => {
      state.error = null
      state.loading = false
      state.name = null
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
    })
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.name = action.payload.name
      state.loading = false
      state.error = null
    })
    builder.addCase(getUser.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getUser.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.loading = false
      state.name = null
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
    })
  },
})

export default userSlice.reducer
