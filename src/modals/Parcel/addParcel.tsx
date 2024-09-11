import React, { useEffect, useState } from 'react'
import { IParcelFields } from '../../models/parcel'
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')
import { Dayjs } from 'dayjs'
import { createParcel } from 'store/reducers/parcelReducer'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { addNotification } from 'store/reducers/notificationHandler'

interface FromValues extends IParcelFields {
  date: Dayjs
}
const AddParcel = () => {
  const dispatch = useAppDispatch()
  const { error, isLoading } = useAppSelector(state => state.parcelReducer)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open])

  useEffect(() => {
    if (!isLoading && error) {
      dispatch(addNotification({ message: error, type: 'error' }))
    }
  }, [error, isLoading])

  const AddParcel = async (values: FromValues) => {
    values.createdAt = values.date.format('YYYY-MM-DD H:mm:ss')
    dispatch(createParcel(values)).then(response => {
      if (response.payload?.id) {
        dispatch(addNotification({ message: 'Отпралвение успешно создано', type: 'success' }))
        setOpen(false)
      }
    })
  }

  return (
    <>
      <Button type={'default'} onClick={() => setOpen(true)}>
        Добавить Отправление
      </Button>
      <Modal
        open={open}
        centered={true}
        onCancel={() => setOpen(false)}
        title={'Add Parcel'}
        footer={[
          <Button key='back' onClick={() => setOpen(false)}>
            Отмена
          </Button>,
          <Button loading={isLoading} key='submit' type='primary' onClick={() => form.submit()}>
            Добавить
          </Button>,
        ]}
      >
        <Form form={form} onFinish={AddParcel}>
          <Form.Item name={'realTrackNumber'} label={'Настоящий трекномер'}>
            <Input />
          </Form.Item>
          <Form.Item name={'type'} label={'Тип посылки'} rules={[{ required: true }]}>
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
          <Form.Item name={'sender'} label={'ФИО отправителя'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'addressFrom'} label={'Адрес отправителя'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'receiver'} label={'ФИО получателя'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'addressTo'} label={'Адрес получателя'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label={'Дата'} name={'date'} initialValue={dayjs(new Date())} rules={[{ required: true }]}>
            <DatePicker
              allowClear={false}
              format={'DD.MM.YYYY H:mm:ss'}
              changeOnBlur={true}
              showTime={true}
            ></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default AddParcel
