import React, { useEffect, useState } from 'react'
import { IParcelStatus } from '../../models/parcel'
import { Button, Col, DatePicker, Form, Input, Modal, notification, Row } from 'antd'
import dayjs from 'dayjs'
import { connect, ConnectedProps } from 'react-redux'
import { addParcelStatus, getParcelById } from '../../store/actions'
import { useNavigate } from 'react-router-dom'
import { set } from 'js-cookie'
import { Dayjs } from 'dayjs'
const mapDispatchToProps = {
  addParcelStatus,
  getParcelById,
}
const connector = connect(null, mapDispatchToProps)
type AddStatusProps = ConnectedProps<typeof connector> & { parcelId: number }
type FromValues = {
  description: string
  date: Dayjs
}
const AddStatus = ({ parcelId, addParcelStatus, getParcelById }: AddStatusProps) => {
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

  const addStatus = async (values: FromValues) => {
    setStatus(
      await addParcelStatus(
        {
          description: values.description,
          createdAt: values.date.format('YYYY-MM-DD H:mm:ss'),
        },
        parcelId,
      ),
    )
  }
  return (
    <>
      <Row justify={'end'}>
        <Col md={24}>
          <Button type={'default'} onClick={() => setOpen(true)}>
            Add Status
          </Button>
        </Col>
      </Row>

      <Modal
        open={open}
        centered={true}
        onCancel={() => setOpen(false)}
        title={'Add Status'}
        footer={[
          <Button key='back' onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key='submit' type='primary' onClick={() => form.submit()}>
            Add
          </Button>,
        ]}
      >
        <Form form={form} onFinish={addStatus}>
          <Form.Item label={'Description'} name={'description'} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label={'Date'} name={'date'} initialValue={dayjs(new Date())} rules={[{ required: true }]}>
            <DatePicker showTime={true}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default connector(AddStatus)
