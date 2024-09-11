import { createAsyncThunk, createSlice, current, PayloadAction } from '@reduxjs/toolkit'
import IParcel, { IParcelFields, IParcels, IParcelStatus, IParcelStatusFields } from '../../models/parcel'
import { IUser } from 'models/user'
import axiosInstance from 'untils'
import { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { getUser, login, logout } from 'store/reducers/userReducer'

interface ParcelState {
  parcels: IParcel[]
  parcel: IParcel | null
  isLoading: boolean
  error: string | null
  total: number
}
const parcelState: ParcelState = {
  parcels: [],
  total: 0,
  parcel: null,
  isLoading: false,
  error: null,
}
export const getParcels = createAsyncThunk<IParcels, { page: number; limit: number }, { rejectValue: void }>(
  'getParcels',
  async ({ page, limit }) => {
    const response = await axiosInstance.get<void, AxiosResponse<IParcels>>(`/parcel`, {
      params: {
        page,
        limit,
      },
    })
    return response.data
  },
)
export const getParcel = createAsyncThunk<IParcel, number, { rejectValue: void }>('getParcel', async id => {
  const response = await axiosInstance.get<void, AxiosResponse<IParcel>>(`/parcel/${id}`)
  return response.data
})
export const getParcelByTracknumber = createAsyncThunk<IParcel, string, { rejectValue: void }>(
  'getParcelByTracknumber',
  async tracknumber => {
    const response = await axiosInstance.get<void, AxiosResponse<IParcel>>(`/parcel/track/${tracknumber}`)
    return response.data
  },
)
export const deleteParcel = createAsyncThunk<number, number, { rejectValue: void }>('deleteParcel', async id => {
  await axiosInstance.delete<void, AxiosResponse<number>>(`/parcel/${id}`)
  return id
})

export const createParcel = createAsyncThunk<IParcel, IParcelFields, { rejectValue: void }>(
  'createParcel',
  async parcel => {
    const response = await axiosInstance.post<void, AxiosResponse<IParcel>>(`/parcel`, parcel)
    return response.data
  },
)
export const updateParcel = createAsyncThunk<IParcel, IParcelFields, { rejectValue: void }>(
  'updateParcel',
  async parcel => {
    const response = await axiosInstance.put<void, AxiosResponse<IParcel>>(`/parcel/${parcel.id}`, parcel)
    return response.data
  },
)

export const deleteParcelStatus = createAsyncThunk<
  number,
  { parcelId: number; statusId: number },
  { rejectValue: void }
>('deleteParcelStatus', async ({ parcelId, statusId }) => {
  await axiosInstance.delete<void, AxiosResponse<number>>(`/parcel/${parcelId}/status/${statusId}`)
  return statusId
})

export const createParcelStatus = createAsyncThunk<
  IParcelStatus,
  { parcelId: number; status: IParcelStatusFields },
  { rejectValue: void }
>('createParcelStatus', async ({ parcelId, status }) => {
  const response = await axiosInstance.post<void, AxiosResponse<IParcelStatus>>(`/parcel/${parcelId}/status`, status)
  return response.data
})
export const updateParcelStatus = createAsyncThunk<
  IParcelStatus,
  { parcelId: number; status: IParcelStatus },
  { rejectValue: void }
>('updateParcelStatus', async ({ parcelId, status }) => {
  const response = await axiosInstance.put<void, AxiosResponse<IParcelStatus>>(
    `/parcel/${parcelId}/status/${status.id}`,
    status,
  )
  return response.data
})

export const parcelSlice = createSlice({
  name: 'postal',
  initialState: parcelState,
  reducers: {
    resetParcel: state => {
      state.parcel = null
      state.error = null
      state.isLoading = false
    },
  },
  extraReducers: builder => {
    builder.addCase(getParcels.fulfilled, (state, action) => {
      state.total = action.payload.total
      state.parcels = action.payload.parcels
      state.isLoading = false
      state.error = null
    })
    builder.addCase(getParcels.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getParcels.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.isLoading = false
      state.parcels = []
      state.total = 0
    })
    builder.addCase(deleteParcel.fulfilled, (state, action) => {
      state.parcels = current(state.parcels).filter(parcel => parcel.id !== action.payload)
      state.isLoading = false
      state.error = null
    })
    builder.addCase(deleteParcel.pending, state => {
      state.error = null
    })
    builder.addCase(deleteParcel.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
    })

    builder.addCase(createParcel.fulfilled, (state, action) => {
      state.parcel = action.payload
      state.parcels = [action.payload, ...current(state.parcels)]
      state.isLoading = false
      state.error = null
    })
    builder.addCase(createParcel.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(createParcel.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.isLoading = false
      state.parcel = null
    })

    builder.addCase(updateParcel.fulfilled, (state, action) => {
      state.parcel = action.payload
      state.isLoading = false
      state.error = null
    })
    builder.addCase(updateParcel.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateParcel.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.isLoading = false
    })

    builder.addCase(getParcel.fulfilled, (state, action) => {
      state.parcel = action.payload
      state.isLoading = false
      state.error = null
    })
    builder.addCase(getParcel.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getParcel.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.isLoading = false
      state.parcel = null
    })
    builder.addCase(getParcelByTracknumber.fulfilled, (state, action) => {
      state.parcel = action.payload
      state.isLoading = false
      state.error = null
    })
    builder.addCase(getParcelByTracknumber.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(getParcelByTracknumber.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.isLoading = false
      state.parcel = null
    })

    builder.addCase(deleteParcelStatus.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
    })
    builder.addCase(deleteParcelStatus.pending, state => {
      state.error = null
    })
    builder.addCase(deleteParcelStatus.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
    })

    builder.addCase(createParcelStatus.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
    })
    builder.addCase(createParcelStatus.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(createParcelStatus.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.isLoading = false
    })

    builder.addCase(updateParcelStatus.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
    })

    builder.addCase(updateParcelStatus.pending, state => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateParcelStatus.rejected, (state, action) => {
      state.error = action.error.message ? action.error.message : 'Unknown error'
      state.isLoading = false
      state.parcel = null
    })
  },
})
export const { resetParcel } = parcelSlice.actions
export default parcelSlice.reducer
