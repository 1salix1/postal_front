import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { getParcelByTracknumber, resetParcel } from 'store/reducers/parcelReducer'
import { Page, Text, View, Document, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer'
import logo from '../../assets/images/logo2.png'
import printImage from '../../assets/images/print.png'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
dayjs.locale('ru')

type SearchFrom = {
  search: string
}
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
    fontSize: '14px',
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
    fontFamily: 'Roboto',
    marginBottom: 3,
  },
  rowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontFamily: 'Roboto',
    marginBottom: 3,
    fontSize: 12,
  },
})

const ParcelTracking: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading, parcel, error } = useAppSelector(state => state.parcelReducer)

  const trackNumber = useParams()['trackNumber'] || ''
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const onFinish = (values: SearchFrom) => {
    navigate('/track/' + values.search)
  }
  useEffect(() => {
    if (trackNumber) {
      dispatch(getParcelByTracknumber(trackNumber))
    } else {
      dispatch(resetParcel())
    }
    form.setFieldValue('search', trackNumber)
  }, [trackNumber])

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
      const MyDocument = (
        <Document>
          <Page size='A4' style={PDFStyles.page}>
            <View style={PDFStyles.row}>
              <Image style={{ width: 100 }} src={logo} />
              <Text style={{ fontSize: '10px', textAlign: 'right', maxWidth: '400px' }}>
                Отчет сформирован официальным сайтом ООО Юцепт ИНН 4345493097 Лицензия Роскомнадзора - 183594
                {dayjs(new Date()).format('DD MMM YYYY в HH:mm')}
              </Text>
            </View>

            <View style={[PDFStyles.section, { marginTop: 40 }]}>
              <View style={PDFStyles.row}>
                <Text>Идентификатор отправления:</Text>
                <Text>{parcel.trackNumber}</Text>
              </View>
            </View>
            <View style={[PDFStyles.section, { marginTop: 40 }]}>
              <View style={PDFStyles.row}>
                <Text>Тип отправления:</Text>
                <Text>{parcelType}</Text>
              </View>
            </View>

            <View style={[PDFStyles.section, { marginTop: 5 }]}>
              <View style={PDFStyles.row}>
                <Text>Отправитель:</Text>
                <Text>{parcel.sender}</Text>
              </View>
            </View>
            <View style={[PDFStyles.section, { marginTop: 5 }]}>
              <View style={PDFStyles.row}>
                <Text>Получатель:</Text>
                <Text>{parcel.receiver}</Text>
              </View>
            </View>

            <View style={[PDFStyles.section, { marginTop: 40 }]}>
              <Text style={{ fontFamily: 'Roboto', marginBottom: 10 }}>История передвижений:</Text>
              <View style={PDFStyles.rowLeft}>
                <Text style={{ marginRight: 63 }}>Дата:</Text>
                <Text>Статус:</Text>
              </View>
              {parcel.statuses.map(status => {
                return (
                  <View key={status.id} style={PDFStyles.rowLeft}>
                    <Text style={{ marginRight: 20 }}>
                      {dayjs(status.createdAt, 'DD.MM.YYYY H:mm:ss').format('DD MMM YYYY')}
                    </Text>
                    <Text>{status.description}</Text>
                  </View>
                )
              })}
            </View>
            <View style={[PDFStyles.row, { justifyContent: 'flex-end' }]}>
              <Image style={{ width: 100 }} src={printImage} />
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
      a.download = `${parcel.trackNumber}_${dayjs(new Date()).format('DD-MM-YYYY')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={'track'}>
      <section className={'top_section'}>
        <div className={'container'}>
          <Row align={'middle'}>
            <Col className={'search_form_container'} xs={24}>
              <h4>
                Найти своё отправление
                <span className='dot-elastic'></span>
              </h4>
              <Form form={form} onFinish={onFinish} className={'search_form'} autoComplete={'off'}>
                <Form.Item
                  name={'search'}
                  noStyle={true}
                  initialValue={trackNumber}
                  rules={[{ required: true, message: 'Введите номер отправления' }]}
                >
                  <Input allowClear placeholder={'Номер отправления'} autoComplete={'off'} />
                </Form.Item>
                <Button loading={isLoading} type={'primary'} htmlType={'submit'}>
                  Найти
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
                {trackNumber && !parcel && <div>Отправление не найдено</div>}
              </div>
            </Col>
          </Row>
          {parcel && (
            <>
              <Row justify={'center'}>
                <Col md={8} xs={20}>
                  <div className={'track_info__parcel_info'}>
                    <div>
                      <i className='fa-solid fa-user'></i>Отправитель: {parcel.sender}
                    </div>

                    <div>
                      <i className='fa-solid fa-location-dot'></i>Адрес отправителя: {parcel.addressFrom}
                    </div>
                    <div>
                      <i className='fa-solid fa-user'></i>Получатель: {parcel.receiver}
                    </div>
                    <div>
                      <i className='fa-solid fa-location-dot'></i>Адрес получателя: {parcel.addressTo}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row justify={'center'}>
                <Button onClick={print}>Распечатать</Button>
              </Row>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
export default ParcelTracking
