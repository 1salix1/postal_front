import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, IUserState, UserResponse } from '../../models/user'
import Cookies from 'js-cookie'

const userState: IUserState = {
  name: null,
}
export const userSlice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      console.log('setUser')
      if (action.payload?.name) {
        state.name = action.payload.name
      }
    },
    setData(state, action: PayloadAction<IUser | null>) {
      console.log(action.payload)
      if (!action.payload) {
        state.name = null
        Cookies.remove('refreshToken')
        Cookies.remove('accessToken')
      } else {
        console.log(action.payload)
        state.name = action.payload.name
        const date = new Date()
        date.setHours(date.getHours() + 1)
        Cookies.set('refreshToken', action.payload.refreshToken, {
          secure: true,
          sameSite: 'strict',
          expires: 30,
          path: '/',
        })

        Cookies.set('accessToken', action.payload.token, {
          secure: true,
          sameSite: 'strict',
          expires: date,
          path: '/',
        })
      }
    },
  },
})

export default userSlice.reducer
