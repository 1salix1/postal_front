import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'
import parcelImage from '../../assets/images/parcel_bg.png'
type SearchFrom = {
  search: string
}
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { getParcelByTracknumber, resetParcel } from 'store/reducers/parcelReducer'

const Main = () => {
  const dispatch = useAppDispatch()
  const { isLoading, parcel, error } = useAppSelector(state => state.parcelReducer)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [trackNumber, setTrackNumber] = useState('')
  const onFinish = async (values: SearchFrom) => {
    setTrackNumber(values.search)
    dispatch(getParcelByTracknumber(values.search))
  }
  useLayoutEffect(() => {
    dispatch(resetParcel())
  }, [])
  useEffect(() => {
    if (parcel?.id && trackNumber) {
      navigate('/track/' + trackNumber)
    }
  }, [parcel])

  return (
    <div className={'main'}>
      <section className={'top_section'}>
        <div className={'container'}>
          <Row align={'middle'} justify={'center'}>
            <div className={'top_section__header'}>
              <h1>Юцепт</h1>
              <h3>Деловая почта</h3>
            </div>
            <div className={'top_section__img'}>
              <img src={parcelImage} />
            </div>
          </Row>
          <Row justify={'center'}>
            <Col className={'search_form_container'} lg={12} xs={24}>
              <h4>
                Отследить отправление
                <span className='dot-elastic'></span>
              </h4>
              <Form form={form} onFinish={onFinish} className={'search_form column'}>
                <Row justify={'start'} wrap={false}>
                  <Form.Item name='search' noStyle={true}>
                    <Input placeholder={'Номер отправления'} />
                  </Form.Item>
                  <Button loading={isLoading} type={'primary'} htmlType={'submit'}>
                    Найти
                  </Button>
                </Row>
                {error && <div className={'search_form__error'}>{error}</div>}
              </Form>
            </Col>
          </Row>
        </div>
      </section>

      <section className={'information'}>
        <div className={'container'}>
          <Row justify={'center'}>
            <Col xs={24} className={'information__text'}>
              Почтовые услуги для юристов и организаций, адресованные в суды, прокуратуру, следственные органы, иные
              государственные органы. Работа строится на основании долгосрочных договоров с предоставлением удобных
              сервисов, таких как: Телефонограмма; Электронные сообщения; Отправление на электронную почту с
              предоставлением подтверждающих документов; Доставка писем в определенную дату; Прием писем дистанционно и
              по месту нахождения отправителя; СМС - информирование и другие
              <br />
              <br />
              Мы молодая компания и мы в поиске лучших сервисов для наших клиентов. Просим быть к нам терпимее, и мы
              постараемся оправдать ваши ожидания.
            </Col>
          </Row>
          <Row align={'top'}>
            <Col xs={24} className={'about_us'}>
              <h3>О компании</h3>
              <Row align={'bottom'}>
                <Col xs={24} sm={8}>
                  Часы работы:
                  <br /> Пн-чт с 09:00 до 18:00
                  <br />
                  Пт с 09:00 до 17:00
                  <br />
                  Обед 12:00-13:00{' '}
                </Col>
                <Col xs={24} sm={8}>
                  ИНН 4345493097
                  <br />
                  Адрес: 610020, г. Киров, ул. Карла Маркса, д. 21 <br />
                </Col>
                <Col xs={24} sm={8}>
                  Телефон <a href={'tel:+79229918000'}>8 922 991 8000</a>
                  <br />
                  Почта: <a href={'mailto:89229918000@mail.ru'}>89229918000@mail.ru</a>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  )
}
export default Main
