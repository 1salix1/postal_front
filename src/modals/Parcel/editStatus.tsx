import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, Modal, notification } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

import { Dayjs } from 'dayjs'
import { EditFilled } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { IParcelStatus } from 'models/parcel'
import { addNotification } from 'store/reducers/notificationHandler'
import { getParcel, updateParcelStatus } from 'store/reducers/parcelReducer'

type FromValues = {
  description: string
  date: Dayjs
}
const EditStatus = ({ parcelStatus }: { parcelStatus: IParcelStatus }) => {
  const dispatch = useAppDispatch()
  const { isLoading, parcel } = useAppSelector(state => state.parcelReducer)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const updateStatus = async (values: FromValues) => {
    if (parcel && parcelStatus) {
      dispatch(
        updateParcelStatus({
          parcelId: parcel.id,
          status: {
            id: parcelStatus.id,
            description: values.description,
            createdAt: values.date.format('YYYY-MM-DD H:mm:ss'),
          },
        }),
      ).then(response => {
        if (response.payload?.id) {
          dispatch(getParcel(parcel.id))
          dispatch(addNotification({ message: 'Статус успешно обновлен', type: 'success' }))
          setOpen(false)
        }
      })
    }
  }
  return (
    parcel &&
    parcelStatus && (
      <>
        <EditFilled onClick={() => setOpen(true)} />
        <Modal
          open={open}
          centered={true}
          onCancel={() => setOpen(false)}
          title={'Редактировать Статус'}
          footer={[
            <Button key='back' onClick={() => setOpen(false)}>
              Отмена
            </Button>,
            <Button loading={isLoading} key='submit' type='primary' onClick={() => form.submit()}>
              Изменить
            </Button>,
          ]}
        >
          <Form form={form} onFinish={updateStatus}>
            <Form.Item
              label={'Описание'}
              name={'description'}
              initialValue={parcelStatus.description}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={'Дата'}
              name={'date'}
              initialValue={dayjs(parcelStatus.createdAt, 'DD.MM.YYYY H:mm:ss')}
              rules={[{ required: true }]}
            >
              <DatePicker
                allowClear={false}
                format={'DD.MM.YYYY H:mm:ss'}
                showTime={true}
                changeOnBlur={true}
              ></DatePicker>
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  )
}
export default EditStatus
