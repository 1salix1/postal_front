import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, notification, Popconfirm, Row, Select } from 'antd'
import { AddStatus, EditStatus } from '../../modals/Parcel'
import { getParcelById, updateParcel, deleteParcelStatus } from '../../store/actions'
import { IParcelFields } from '../../models/parcel'
import { DeleteFilled } from '@ant-design/icons'
const mapStateToProps = (state: RootState) => ({
  parcel: state.parcelReducer.parcel,
  error: state.errorHandler.error,
})
const mapDispatchToProps = {
  getParcelById,
  updateParcel,
  deleteParcelStatus,
}
const connector = connect(mapStateToProps, mapDispatchToProps)

type ParcelProps = ConnectedProps<typeof connector>
const Parcel: React.FC<ParcelProps> = ({ getParcelById, parcel, updateParcel, deleteParcelStatus }) => {
  const [parcelId] = useState<number | null>(useLocation().state?.parcelId)
  const [parcelFrom] = Form.useForm()
  const navigate = useNavigate()
  const [api] = notification.useNotification()
  const [status, setStatus] = useState(false)

  const fetchData = async (id: number) => {
    if (!(await getParcelById(id))) navigate('/parcels')
  }
  useEffect(() => {
    if (status)
      api['success']({
        message: 'Success',
        description: 'Parcel Updated Successfully',
        placement: 'bottomLeft',
        duration: 2,
      })
  }, [status])

  const editParcel = async (values: IParcelFields) => {
    setStatus(!!parcel && (await updateParcel(values, parcel.id)))
  }

  useEffect(() => {
    if (!parcelId) {
      navigate('/parcels')
      return
    }
    fetchData(parcelId).then(() => {
      parcelFrom.setFieldsValue(parcel)
    })
  }, [parcelId])

  return (
    parcel && (
      <div className={'parcel'}>
        <div className={'container'}>
          <Row justify={'start'} className={'parcels_header'}>
            <Button onClick={() => navigate(-1)}>Back</Button>
            <h3>Parcel {parcel.trackNumber}</h3>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col md={12} xs={24}>
              <Form form={parcelFrom} onFinish={editParcel}>
                <Form.Item name={'trackNumber'} label={'Tracking Number'} initialValue={parcel?.trackNumber}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item
                  name={'realTrackNumber'}
                  label={'Real Tracking Number'}
                  initialValue={parcel?.realTrackNumber}
                >
                  <Input />
                </Form.Item>
                <Form.Item name={'type'} label={'Parcel Type'} initialValue={parcel?.type} rules={[{ required: true }]}>
                  <Select
                    showSearch={true}
                    options={[
                      { value: 1, label: 'Letter' },
                      { value: 2, label: 'Parcel' },
                      { value: 3, label: 'Another' },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={'sender'}
                  label={'Sender Info'}
                  initialValue={parcel?.sender}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'addressFrom'}
                  label={'Sender Address'}
                  initialValue={parcel?.addressFrom}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'receiver'}
                  label={'Receiver Info'}
                  initialValue={parcel?.receiver}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'addressTo'}
                  label={'Receiver Address'}
                  initialValue={parcel?.addressTo}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Button type={'primary'} htmlType={'submit'}>
                  Update
                </Button>
              </Form>
            </Col>
            <Col md={12} xs={24}>
              <AddStatus parcelId={parcel.id} />
              <div className={'parcel_statuses'}>
                {parcel.statuses.map(status => {
                  return (
                    <div key={status.id} className={'parcel_status'}>
                      <div>
                        <h4>{status.description}</h4>
                        <div className={'parcel_status__date'}>{status.createdAt}</div>
                      </div>
                      <div className={'parcel_status__actions'}>
                        <EditStatus parcelId={parcel.id} parcelStatus={status} />
                        <Popconfirm
                          title='Delete the Status'
                          description='Are you sure to delete this Status?'
                          onConfirm={() => deleteParcelStatus(status.id, parcel.id)}
                          okText='Yes'
                          cancelText='No'
                        >
                          <DeleteFilled />
                        </Popconfirm>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  )
}
export default connector(Parcel)
