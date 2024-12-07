import React, { useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, InputNumber, Popconfirm, Row, Select } from 'antd'
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
    flexWrap: 'wrap',
    marginBottom: 3,
    fontSize: 10,
  },
  rowLeftInformation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontFamily: 'Roboto',
    alignItems: 'flex-start',
    fontSize: 8,
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
  text: {
    fontWeight: 400,
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 5,
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
      let parcelType = 'Заказное'
      if (parcel.type === 2) {
        parcelType = 'С описью вложения'
      }
      if (parcel.type === 3) {
        parcelType = 'Бандероль'
      }
      if (parcel.type === 4) {
        parcelType = 'Посылка'
      }
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
            <View style={[PDFStyles.rowLeft, { flexWrap: 'nowrap' }]}>
              <View
                style={[
                  PDFStyles.row,
                  { flexWrap: 'wrap', flexDirection: 'column', marginRight: 'auto', maxWidth: 290 },
                ]}
              >
                <View style={[PDFStyles.rowLeft]}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>От Кого:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.sender}</Text>
                </View>
                <View style={[PDFStyles.rowLeft]}>
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
                  <Text style={{ fontWeight: 700, marginRight: 'auto' }}>Вид Отправления:</Text>
                  <Text style={{ fontWeight: 400, marginLeft: 5 }}>{parcelType}</Text>
                </View>
              </View>
              <Image src={qrCodeURL} style={{ width: 50, height: 50, marginLeft: 10 }} />
            </View>
            <View style={[PDFStyles.row, { marginTop: 100 }]}>
              <View
                style={[
                  PDFStyles.row,
                  { flexWrap: 'wrap', flexDirection: 'column', marginLeft: 'auto', maxWidth: 320 },
                ]}
              >
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

  const printReceipt = async () => {
    if (parcel) {
      let parcelType = 'Заказное'
      if (parcel.type === 2) {
        parcelType = 'С описью вложения'
      }
      if (parcel.type === 3) {
        parcelType = 'Бандероль'
      }
      if (parcel.type === 4) {
        parcelType = 'Посылка'
      }
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
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'nowrap',
              }}
            >
              <View style={{ width: '30%', border: '1px solid #000', padding: 10 }}>
                <Text style={[PDFStyles.text, { borderBottom: '1px solid #000', paddingBottom: 5 }]}>
                  ООО «Юцепт» ИНН 4345493097
                </Text>
                <Text style={[PDFStyles.text, { marginBottom: 2 }]}>
                  610020, г. Киров, ул. Карла Маркса, д. 21 оф. 225
                </Text>
                <Text style={[PDFStyles.text, { marginBottom: 10 }]}>
                  Дата: {dayjs(date, 'DD.MM.YYYY').format('DD.MM.YYYY')}
                </Text>
                <Text style={[PDFStyles.text, { marginBottom: 0 }]}>Почтовая квитанция</Text>
                <Text style={[PDFStyles.text, { marginBottom: 10 }]}>№ {parcel.trackNumber}</Text>
                <Text style={[PDFStyles.text, { textAlign: 'left' }]}>Принято: Почтовое отправление</Text>
                <Text style={[PDFStyles.text, { textAlign: 'left' }]}>Тип отправления: {parcelType}</Text>
                {parcel.weight && (
                  <Text style={[PDFStyles.text, { textAlign: 'left', marginBottom: 10 }]}>
                    Вес отправления: {parcel.weight} г
                  </Text>
                )}
                <Text style={[PDFStyles.text, { textAlign: 'left' }]}>От Кого: {parcel.sender}</Text>
                <Text style={[PDFStyles.text, { textAlign: 'left', marginBottom: 2 }]}>Кому: {parcel.receiver}</Text>
                <Text style={[PDFStyles.text, { textAlign: 'left', marginBottom: 20 }]}>Куда: {parcel.addressTo}</Text>
                <Text style={[PDFStyles.text, { textAlign: 'left', marginBottom: 10 }]}>
                  Принял: __________________ подпись
                </Text>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                  }}
                >
                  <Text>М.П.</Text>
                  <Image src={qrCodeURL} style={{ width: 30, height: 30 }} />
                </View>
              </View>
              <View style={{ width: '67%', border: '1px solid #000', padding: 10 }}>
                <Text style={{ fontWeight: 700, textAlign: 'center', fontSize: 13, marginBottom: 15 }}>
                  Расписка в получении
                </Text>

                <View style={[PDFStyles.rowLeft, { marginBottom: 0 }]}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Кому:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.receiver}</Text>
                </View>
                <View style={[PDFStyles.rowLeft, { marginBottom: 10 }]}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Адрес:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.addressTo}</Text>
                </View>
                <View style={[PDFStyles.rowLeft, { marginBottom: 0 }]}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Отправитель:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.sender}</Text>
                </View>
                <View style={[PDFStyles.rowLeft, { marginBottom: 15 }]}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Откуда:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcel.addressFrom}</Text>
                </View>
                <View style={PDFStyles.rowLeft}>
                  <Text style={{ fontWeight: 700, marginRight: 5 }}>Вид и категория:</Text>
                  <Text style={{ fontWeight: 400 }}>{parcelType}</Text>
                </View>
                {parcel.weight && (
                  <View style={PDFStyles.rowLeft}>
                    <Text style={{ fontWeight: 700, marginRight: 5 }}>Масса:</Text>
                    <Text style={{ fontWeight: 400 }}>{parcel.weight} г</Text>
                  </View>
                )}
                <Text style={{ fontWeight: 700, marginTop: 15 }}>Отметка о принятии:</Text>
                <Text style={{ fontWeight: 400 }}>
                  _______________________________________________________________________
                  _______________________________________________________________________
                </Text>
                <Text style={{ fontWeight: 400, fontSize: 8, textAlign: 'center' }}>(дата, должность, подпись)</Text>
                <Image src={qrCodeURL} style={{ width: 40, height: 40, position: 'absolute', right: 20, bottom: 50 }} />
              </View>
            </View>
          </Page>
        </Document>
      )

      const blob = await pdf(MyDocument).toBlob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      // the filename you want
      a.download = `Квитанция.pdf`
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
            <Button style={{ margin: 3 }} onClick={() => print()}>
              Печать конверта
            </Button>
            <Button style={{ margin: 3 }} onClick={() => printReceipt()}>
              Печать квитанции
            </Button>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col md={12} xs={24}>
              <Form form={parcelFrom} onFinish={editParcel} labelCol={{ md: 10, sm: 8, xs: 24 }}>
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
                  label={'Отправитель'}
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
                  label={'Получатель'}
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
                <Form.Item
                  name={'weight'}
                  label={'Вес отправления (г)'}
                  initialValue={parcel?.weight}
                  rules={[{ required: false }]}
                >
                  <InputNumber precision={0} min={0} max={10000} />
                </Form.Item>
                <Button style={{ float: 'right' }} loading={isLoading} type={'primary'} htmlType={'submit'}>
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
