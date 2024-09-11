import React, { useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Popconfirm, Row, Select } from 'antd'
import { AddStatus, EditStatus } from '../../modals/Parcel'
import { IParcelFields } from '../../models/parcel'
import { DeleteFilled } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { deleteParcelStatus, getParcel, updateParcel } from 'store/reducers/parcelReducer'
import { addNotification } from 'store/reducers/notificationHandler'

const Parcel: React.FC = () => {
  const dispatch = useAppDispatch()
  const { error, isLoading, parcel } = useAppSelector(state => state.parcelReducer)
  const [parcelId] = useState<number | null>(useLocation().state?.parcelId)
  const [parcelFrom] = Form.useForm()
  const navigate = useNavigate()

  const editParcel = async (values: IParcelFields) => {
    if (parcel) {
      values.id = parcel.id
      dispatch(updateParcel(values)).then(response => {
        if (response.payload?.id) {
          dispatch(addNotification({ message: 'Отпралвение успешно обновлено', type: 'success' }))
        }
      })
    }
  }

  useEffect(() => {
    if (!parcelId) {
      navigate('/parcels')
      return
    }
    dispatch(getParcel(+parcelId))
  }, [parcelId])

  useEffect(() => {
    if (!isLoading && error) {
      dispatch(addNotification({ message: error, type: 'error' }))
    }
  }, [error, isLoading])

  const onDelete = (statusId: number, parcelId: number) => {
    dispatch(deleteParcelStatus({ parcelId, statusId })).then(response => {
      if (response.payload) {
        dispatch(getParcel(+parcelId))
        dispatch(addNotification({ message: 'Статус успешно удален', type: 'success' }))
      }
    })
  }

  return (
    parcel && (
      <div className={'parcel'}>
        <div className={'container'}>
          <Row justify={'start'} className={'parcels_header'}>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <h3>Отправление {parcel.trackNumber}</h3>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col md={12} xs={24}>
              <Form form={parcelFrom} onFinish={editParcel}>
                <Form.Item name={'trackNumber'} label={'Трекномер'} initialValue={parcel?.trackNumber}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item
                  name={'realTrackNumber'}
                  label={'Настоящий трекномер'}
                  initialValue={parcel?.realTrackNumber}
                >
                  <Input />
                </Form.Item>
                <Form.Item name={'type'} label={'Тип посылки'} initialValue={parcel?.type} rules={[{ required: true }]}>
                  <Select
                    showSearch={true}
                    options={[
                      { value: 1, label: 'Заказное письмо' },
                      { value: 2, label: 'Ценное письмо с описью вложения' },
                      { value: 3, label: 'Бандероль' },
                      { value: 4, label: 'Посылка' },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name={'sender'}
                  label={'ФИО отправителя'}
                  initialValue={parcel?.sender}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'addressFrom'}
                  label={'Адрес отправителя'}
                  initialValue={parcel?.addressFrom}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'receiver'}
                  label={'ФИО получателя'}
                  initialValue={parcel?.receiver}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'addressTo'}
                  label={'Адрес получателя'}
                  initialValue={parcel?.addressTo}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Button loading={isLoading} type={'primary'} htmlType={'submit'}>
                  Изменить
                </Button>
              </Form>
            </Col>
            <Col md={12} xs={24}>
              <AddStatus />
              <div className={'parcel_statuses'}>
                {parcel.statuses.map(status => {
                  return (
                    <div key={status.id} className={'parcel_status'}>
                      <div>
                        <h4>{status.description}</h4>
                        <div className={'parcel_status__date'}>{status.createdAt}</div>
                      </div>
                      <div className={'parcel_status__actions'}>
                        <EditStatus parcelStatus={status} />
                        <Popconfirm
                          title='Удалить статус'
                          description='Подтвердите удаление статуса'
                          onConfirm={() => onDelete(status.id, parcel.id)}
                          okText='Подтверждаю'
                          cancelText='Отмена'
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
export default Parcel
