import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'

import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store/store'
import { getParcel } from '../../store/actions'
import { useParams, redirect, useNavigate } from 'react-router-dom'
const mapStateToProps = (state: RootState) => ({
  parcel: state.parcelReducer.parcel,
  isLoading: state.parcelReducer.isLoading,
})
const mapDispatchToProps = {
  getParcel,
}
const connector = connect(mapStateToProps, mapDispatchToProps)

type ParcelTrackingProps = ConnectedProps<typeof connector>

type SearchFrom = {
  search: string
}

const ParcelTracking: React.FC<ParcelTrackingProps> = ({ parcel, getParcel }) => {
  const trackNumber = useParams()['trackNumber']
  const [form] = Form.useForm()
  const navigate = useNavigate()
  console.log(parcel)
  const onFinish = (values: SearchFrom) => {
    navigate('/track/' + values.search)
  }
  useEffect(() => {
    trackNumber && getParcel(trackNumber)
    form.setFieldValue('search', trackNumber)
  }, [trackNumber])
  return (
    <div className={'track'}>
      <section className={'top_section'}>
        <div className={'container'}>
          <Row align={'middle'}>
            <Col className={'search_form_container'} xs={24}>
              <h4>
                Find your parcel
                <span className='dot-elastic'></span>
              </h4>
              <Form form={form} onFinish={onFinish} className={'search_form'} autoComplete={'off'}>
                <Form.Item
                  name={'search'}
                  noStyle={true}
                  initialValue={trackNumber}
                  rules={[{ required: true, message: 'Please input your trackNumber' }]}
                >
                  <Input placeholder={'Search'} autoComplete={'off'} />
                </Form.Item>
                <Button type={'primary'} htmlType={'submit'}>
                  Search
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </section>
      <section className={'track_info'}>
        <div className={'container'}>
          <Row justify={'center'}>
            <Col md={8} xs={24}>
              <div className={'track_info__statuses'}>
                {parcel &&
                  parcel.statuses?.map((status, index) => {
                    return (
                      <div key={status.id} className={index === 0 ? 'track_info__status active' : 'track_info__status'}>
                        <h4>{status.description}</h4>
                        <div className={'track_info__status_date'}>{status.createdAt}</div>
                      </div>
                    )
                  })}
                {trackNumber && !parcel && <div>Tracking number not Found</div>}
              </div>
            </Col>
          </Row>
          {parcel && (
            <Row justify={'center'}>
              <Col md={8} xs={20}>
                <div className={'track_info__parcel_info'}>
                  <div>
                    <i className='fa-solid fa-user'></i>Sender: {parcel.sender}
                  </div>

                  <div>
                    <i className='fa-solid fa-location-dot'></i>From: {parcel.addressFrom}
                  </div>
                  <div>
                    <i className='fa-solid fa-user'></i>Receiver: {parcel.receiver}
                  </div>
                  <div>
                    <i className='fa-solid fa-location-dot'></i>To: {parcel.addressTo}
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </section>
    </div>
  )
}
export default connector(ParcelTracking)
