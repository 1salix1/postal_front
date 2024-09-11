export interface IParcelStatus extends IParcelStatusFields {
  id: number
}
export interface IParcelStatusFields {
  description: string
  createdAt: string
}
export default interface IParcel extends IParcelFields {
  id: number
  statuses: IParcelStatus[]
}
export interface IParcelFields {
  id?: number
  sender: string
  receiver: string
  type: number
  trackNumber?: string
  realTrackNumber?: string
  addressFrom: string
  addressTo: string
  createdAt?: string
}

export interface IParcels {
  parcels: IParcel[]
  total: number
}

interface IParcelResponseSuccess {
  status: true
  parcel: IParcel
}
interface ResponseFailed {
  status: false
  errorMessage: string
}
interface IParcelsResponseSuccess extends IParcels {
  status: true
}

export type ParcelResponse = IParcelResponseSuccess | ResponseFailed
export type ParcelsResponse = IParcelsResponseSuccess | ResponseFailed

interface IParcelStatusResponseSuccess {
  status: true
  parcelStatus: IParcelStatus
}
export type ParcelStatusResponse = IParcelStatusResponseSuccess | ResponseFailed
