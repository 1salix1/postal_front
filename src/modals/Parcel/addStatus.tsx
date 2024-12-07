import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

import { Dayjs } from 'dayjs'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { createParcelStatus, getParcel } from 'store/reducers/parcelReducer'
import { addNotification } from 'store/reducers/notificationHandler'

type FromValues = {
  description: string
  date: Dayjs
}
const AddStatus = () => {
  const dispatch = useAppDispatch()
  const { isLoading, parcel } = useAppSelector(state => state.parcelReducer)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open])

  const addStatus = async (values: FromValues) => {
    if (parcel) {
      dispatch(
        createParcelStatus({
          parcelId: parcel.id,
          status: {
            description: values.description,
            createdAt: values.date.format('YYYY-MM-DD H:mm:ss'),
          },
        }),
      ).then(response => {
        if (response.payload?.id) {
          dispatch(getParcel(parcel.id))
          dispatch(addNotification({ message: 'Статус успешно добавлен', type: 'success' }))
          setOpen(false)
        }
      })
    }
  }
  return (
    <>
      <Row justify={'end'}>
        <Col md={24}>
          <Button type={'default'} onClick={() => setOpen(true)}>
            Добавить Статус
          </Button>
        </Col>
      </Row>

      <Modal
        open={open}
        centered={true}
        onCancel={() => setOpen(false)}
        title={'Добавить Статус'}
        footer={[
          <Button key='back' onClick={() => setOpen(false)}>
            Отмена
          </Button>,
          <Button loading={isLoading} key='submit' type='primary' onClick={() => form.submit()}>
            Добавить
          </Button>,
        ]}
      >
        <Form form={form} onFinish={addStatus} labelCol={{ sm: 6, xs: 24 }}>
          <Form.Item label={'Описание'} name={'description'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label={'Дата'} name={'date'} initialValue={dayjs(new Date())} rules={[{ required: true }]}>
            <DatePicker
              allowClear={false}
              format={'DD.MM.YYYY H:mm:ss'}
              showTime={true}
              changeOnBlur={true}
              style={{ width: '100%' }}
            ></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default AddStatus
