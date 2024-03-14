import { AppDispatch } from '../store'
import IParcel, {
  IParcelFields,
  IParcelStatus,
  IParcelStatusFields,
  ParcelResponse,
  ParcelsResponse,
  ParcelStatusResponse,
} from '../../models/parcel'
import { parcelSlice } from '../reducers/parcelReducer'
import axiosInstance from '../../untils'
import axios, { AxiosError } from 'axios'
import { errorSlice } from '../reducers/errorHandler'

export const getParcel = (trackNumber: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(parcelSlice.actions.setLoading(true))
    const response = await axiosInstance.get<ParcelResponse>('/parcel/track/' + trackNumber)
    if (response.data?.status) {
      dispatch(parcelSlice.actions.setParcel(response.data.parcel))
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
    dispatch(parcelSlice.actions.setLoading(false))
    dispatch(parcelSlice.actions.setParcel(null))
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}

export const getParcelById = (id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(parcelSlice.actions.setLoading(true))
    const response = await axiosInstance.get<ParcelResponse>('/parcel/' + id)
    if (response.data?.status) {
      dispatch(parcelSlice.actions.setParcel(response.data.parcel))
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
    dispatch(parcelSlice.actions.setLoading(false))
    dispatch(parcelSlice.actions.setParcel(null))
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}

export const updateParcel = (parcel: IParcelFields, id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.put<ParcelResponse>('/parcel/' + id, parcel)
    if (response.data?.status) {
      dispatch(parcelSlice.actions.setParcel(response.data.parcel))
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
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}
export const addParcel = (parcel: IParcelFields) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post<ParcelResponse>('/parcel/', parcel)
    if (response.data?.status) {
      dispatch(parcelSlice.actions.addParcel(response.data.parcel))
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
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}

export const deleteParcel = (id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.delete<ParcelResponse>('/parcel/' + id)
    if (response.data?.status) {
      dispatch(parcelSlice.actions.deleteParcel(id))
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
    dispatch(errorSlice.actions.setError(error))
    return false
  }
}

export const getParcelsList = (page: number, limit: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(parcelSlice.actions.setLoading(true))
    const response = await axiosInstance.get<ParcelsResponse>('/parcel/', {
      params: {
        page,
        limit,
      },
    })
    if (response.data?.status) {
      dispatch(parcelSlice.actions.setParcelsList(response.data))
    } else {
      throw response.data.errorMessage
    }
  } catch (e: AxiosError | unknown) {
    let error = ''
    if (axios.isAxiosError(e)) {
      error = e.message
    } else {
      error = <string>e
    }
    dispatch(errorSlice.actions.setError(error))
    dispatch(parcelSlice.actions.setLoading(false))
    dispatch(parcelSlice.actions.setParcelsList({ parcels: [], total: 0 }))
  }
}

export const addParcelStatus =
  (status: IParcelStatusFields, parcelId: number) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const response = await axiosInstance.post<ParcelStatusResponse>(`/parcel/${parcelId}/status`, status)
      if (!response.data?.status) throw response.data.errorMessage

      return true
    } catch (e: AxiosError | unknown) {
      let error = ''
      if (axios.isAxiosError(e)) {
        error = e.message
      } else {
        error = <string>e
      }
      dispatch(errorSlice.actions.setError(error))
      return false
    }
  }
export const updateParcelStatus =
  (status: IParcelStatusFields, parcelId: number, id: number) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const response = await axiosInstance.put<ParcelStatusResponse>(`/parcel/${parcelId}/status/${id}`, status)
      if (!response.data?.status) throw response.data.errorMessage

      return true
    } catch (e: AxiosError | unknown) {
      let error = ''
      if (axios.isAxiosError(e)) {
        error = e.message
      } else {
        error = <string>e
      }
      dispatch(errorSlice.actions.setError(error))
      return false
    }
  }
export const deleteParcelStatus =
  (id: number, parcelId: number) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const response = await axiosInstance.delete<ParcelStatusResponse>(`/parcel/${parcelId}/status/${id}`)
      if (response.data?.status) {
        dispatch(parcelSlice.actions.deleteParcelStatus(id))
      } else throw response.data.errorMessage

      return true
    } catch (e: AxiosError | unknown) {
      let error = ''
      if (axios.isAxiosError(e)) {
        error = e.message
      } else {
        error = <string>e
      }
      dispatch(errorSlice.actions.setError(error))
      return false
    }
  }
