import React, { useEffect, useState } from 'react'
import { IParcelStatus } from '../../models/parcel'
import { Button, DatePicker, Form, Input, Modal, notification } from 'antd'
import dayjs from 'dayjs'
import { connect, ConnectedProps } from 'react-redux'
import { addParcelStatus, getParcelById, updateParcelStatus } from '../../store/actions'
import { useNavigate } from 'react-router-dom'
import { set } from 'js-cookie'
import { Dayjs } from 'dayjs'
import { EditFilled } from '@ant-design/icons'
const mapDispatchToProps = {
  updateParcelStatus,
  getParcelById,
}
const connector = connect(null, mapDispatchToProps)
type AddStatusProps = ConnectedProps<typeof connector> & { parcelId: number; parcelStatus: IParcelStatus }
type FromValues = {
  description: string
  date: Dayjs
}
const EditStatus = ({ parcelId, parcelStatus, updateParcelStatus, getParcelById }: AddStatusProps) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [status, setStatus] = useState(false)
  const [api] = notification.useNotification()

  useEffect(() => {
    if (status) {
      api['success']({
        message: 'Success',
        description: 'Status added successfully',
        placement: 'bottomLeft',
        duration: 2,
      })
      getParcelById(parcelId)
      setOpen(false)
    }
  }, [status])

  const updateStatus = async (values: FromValues) => {
    setStatus(
      await updateParcelStatus(
        {
          description: values.description,
          createdAt: values.date.format('YYYY-MM-DD H:mm:ss'),
        },
        parcelId,
        parcelStatus.id,
      ),
    )
  }
  return (
    <>
      <EditFilled onClick={() => setOpen(true)} />
      <Modal
        open={open}
        centered={true}
        onCancel={() => setOpen(false)}
        title={'Edit Status'}
        footer={[
          <Button key='back' onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key='submit' type='primary' onClick={() => form.submit()}>
            Update
          </Button>,
        ]}
      >
        <Form form={form} onFinish={updateStatus}>
          <Form.Item
            label={'Description'}
            name={'description'}
            initialValue={parcelStatus.description}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={'Date'}
            name={'date'}
            initialValue={dayjs(new Date(parcelStatus.createdAt))}
            rules={[{ required: true }]}
          >
            <DatePicker showTime={true}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default connector(EditStatus)
