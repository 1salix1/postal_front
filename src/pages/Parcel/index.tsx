import React, { useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Popconfirm, Row, Select } from 'antd'
import { AddStatus, EditStatus } from '../../modals/Parcel'
import { IParcelFields } from 'models/parcel'
import { DeleteFilled } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { deleteParcelStatus, getParcel, updateParcel } from 'store/reducers/parcelReducer'
import { addNotification } from 'store/reducers/notificationHandler'
import { Page, Text, View, Document, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import { Canvg } from 'canvg'
import { QRCodeSVG } from 'qrcode.react'
import { renderToString } from 'react-dom/server'

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
})

const PDFStyles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontSize: '10px',
    fontWeight: 400,
    fontFamily: 'Roboto',
    padding: '30px 40px',
  },
  section: {
    marginTop: 10,
    fontFamily: 'Roboto',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontFamily: 'Roboto',
    marginBottom: 3,
  },
  rowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontFamily: 'Roboto',
    alignItems: 'flex-start',
    marginBottom: 3,
    fontSize: 10,
  },
  rowLeftInformation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontFamily: 'Roboto',
    alignItems: 'flex-start',
    fontSize: 9,
    width: '100%',
    borderBottom: '1px solid #000',
    padding: 2,
  },
  licence: {
    textAlign: 'right',
    fontSize: 8,
    position: 'absolute',
    right: 30,
    bottom: 40,
  },
})

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

  const svgToDataUri = async (svgString: string) => {
    try {
      const canvas: HTMLCanvasElement = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (context) {
        const v = Canvg.fromString(context, svgString.trim())
        await v.render()
        const dataUri = canvas.toDataURL('image/png')
        return dataUri
      }
    } catch (error) {
      console.error('Error occured:', error)
      return ''
    }
  }

  const print = async () => {
    if (parcel) {
      let parcelType = 'Заказное письмо'
      if (parcel.type === 2) {
        parcelType = 'Ценное письмо с описью вложения'
      }
      if (parcel.type === 3) {
        parcelType = 'Бандероль'
      }
      if (parcel.type === 4) {
        parcelType = 'Посылка'
      }
      /*const sender = {
        last: parcel.sender.split(' ')[0],
        first: parcel.sender.split(' ')[1],
        middle: parcel.sender.split(' ')[2],
      }
      const senderGenitive = petrovich(sender, 'genitive')
      const senderFIO = `${senderGenitive.last} ${senderGenitive.first} ${senderGenitive.middle}`
      const receiver = {
        last: parcel.receiver.split(' ')[0],
        first: parcel.receiver.split(' ')[1],
        middle: parcel.receiver.split(' ')[2],
      }
      const receiverDative = petrovich(receiver, 'dative')
      const receiverFIO = `${receiverDative.last} ${receiverDative.first} ${receiverDative.middle}`*/
      let date = parcel.createdAt
      if (parcel.statuses) {
        if (parcel.statuses[parcel.statuses.length - 1]?.createdAt) {
          date = parcel.statuses[parcel.statuses.length - 1].createdAt
        }
      }
      const qrCode = <QRCodeSVG size={256} value={`https://юцепт.рф/track/${parcel.trackNumber}`} />
      const qrCodeURL = await svgToDataUri(renderToString(qrCode))
      const MyDocument = (
        <Document>
          <Page size='A5' orientation={'landscape'} style={PDFStyles.page}>
            <View style={PDFStyles.rowLeft}>
              <View style={[PDFStyles.row, { flexWrap: 'wrap', flexDirection: 'column', marginRight: 'auto' }]}>
                <View style={PDFStyles.rowLeft}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>От Кого:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.sender}</Text>
                </View>
                <View style={PDFStyles.rowLeft}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Откуда:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.addressFrom}</Text>
                </View>
              </View>
              <View
                style={[
                  PDFStyles.row,
                  { flexWrap: 'wrap', flexDirection: 'column', border: '1px solid #000', borderBottom: 0 },
                ]}
              >
                <View style={PDFStyles.rowLeftInformation}>
                  <Text style={{ fontWeight: 700, marginRight: 'auto' }}>Дата:</Text>
                  <Text style={{ fontWeight: 400, marginLeft: 5 }}>
                    {dayjs(date, 'DD.MM.YYYY').format('DD.MM.YYYY')}
                  </Text>
                </View>
                <View style={PDFStyles.rowLeftInformation}>
                  <Text style={{ fontWeight: 700, marginRight: 'auto' }}>№ Отправления:</Text>
                  <Text style={{ fontWeight: 400, marginLeft: 5 }}>{parcel.trackNumber}</Text>
                </View>
                <View style={PDFStyles.rowLeftInformation}>
                  <Text style={{ fontWeight: 700, marginRight: 'auto' }}>Тип Отправления:</Text>
                  <Text style={{ fontWeight: 400, marginLeft: 5 }}>{parcelType}</Text>
                </View>
              </View>
              <Image src={qrCodeURL} style={{ width: 50, height: 50, marginLeft: 10 }} />
            </View>
            <View style={[PDFStyles.row, { marginTop: 100 }]}>
              <View style={[PDFStyles.row, { flexWrap: 'wrap', flexDirection: 'column', marginLeft: 'auto' }]}>
                <View style={PDFStyles.rowLeft}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Кому:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.receiver}</Text>
                </View>
                <View style={PDFStyles.rowLeft}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Куда:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.addressTo}</Text>
                </View>
              </View>
            </View>
            <Text style={PDFStyles.licence}>Лицензия Роскомнадзора 183594</Text>
          </Page>
        </Document>
      )

      const blob = await pdf(MyDocument).toBlob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      // the filename you want
      a.download = `Бланк Конверта.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    parcel && (
      <div className={'parcel'}>
        <div className={'container'}>
          <Row justify={'start'} className={'parcels_header'}>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <h3>Отправление {parcel.trackNumber}</h3>
            <Button onClick={() => print()}>Печать конверта</Button>
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
