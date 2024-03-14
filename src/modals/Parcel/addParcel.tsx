import React, { useEffect, useState } from 'react'
import { IParcelFields, IParcelStatus } from '../../models/parcel'
import { Button, DatePicker, Form, Input, Modal, notification, Select } from 'antd'
import dayjs from 'dayjs'
import { connect, ConnectedProps } from 'react-redux'
import { addParcel, getParcelsList } from '../../store/actions'
import { Dayjs } from 'dayjs'
const mapDispatchToProps = {
  addParcel,
  getParcelsList,
}
const connector = connect(null, mapDispatchToProps)
type AddParcelProps = ConnectedProps<typeof connector>
interface FromValues extends IParcelFields {
  date: Dayjs
}
const AddParcel = ({ addParcel, getParcelsList }: AddParcelProps) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [status, setStatus] = useState(false)
  const [api] = notification.useNotification()

  const AddParcel = async (values: FromValues) => {
    values.createdAt = values.date.format('YYYY-MM-DD H:mm:ss')
    setStatus(await addParcel(values))
  }
  useEffect(() => {
    if (status) {
      api['success']({
        message: 'Success',
        description: 'Parcel Updated Successfully',
        placement: 'bottomLeft',
        duration: 2,
      })
      setOpen(false)
    }
  }, [status])
  return (
    <>
      <Button type={'default'} onClick={() => setOpen(true)}>
        Add Parcel
      </Button>
      <Modal
        open={open}
        centered={true}
        onCancel={() => setOpen(false)}
        title={'Add Parcel'}
        footer={[
          <Button key='back' onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key='submit' type='primary' onClick={() => form.submit()}>
            Add
          </Button>,
        ]}
      >
        <Form form={form} onFinish={AddParcel}>
          <Form.Item name={'realTrackNumber'} label={'Real Tracking Number'}>
            <Input />
          </Form.Item>
          <Form.Item name={'type'} label={'Parcel Type'} rules={[{ required: true }]}>
            <Select
              showSearch={true}
              options={[
                { value: 1, label: 'Letter' },
                { value: 2, label: 'Parcel' },
                { value: 3, label: 'Another' },
              ]}
            />
          </Form.Item>
          <Form.Item name={'sender'} label={'Sender Info'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'addressFrom'} label={'Sender Address'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'receiver'} label={'Receiver Info'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'addressTo'} label={'Receiver Address'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label={'Date'} name={'date'} initialValue={dayjs(new Date())} rules={[{ required: true }]}>
            <DatePicker changeOnBlur={true} showTime={true}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default connector(AddParcel)
