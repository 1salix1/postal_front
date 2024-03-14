import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'
import parcel from '../../assets/images/parcel_bg.png'
import FaqItem from '../../components/faqItem'
type SearchFrom = {
  search: string
}
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../store/store'
import { getParcel } from '../../store/actions'
import { useNavigate } from 'react-router-dom'
const mapStateToProps = (state: RootState) => ({
  parcel: state.parcelReducer.parcel,
  isLoading: state.parcelReducer.isLoading,
})
const mapDispatchToProps = {
  getParcel,
}
const connector = connect(mapStateToProps, mapDispatchToProps)

type MainProps = ConnectedProps<typeof connector>

const Main = ({ getParcel }: MainProps) => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [searchError, setSearchError] = useState('')
  const onFinish = async (values: SearchFrom) => {
    setSearchError('')
    if (await getParcel(values.search)) {
      navigate('/track/' + values.search)
    } else {
      setSearchError('Parcel not found')
    }
  }

  return (
    <div className={'main'}>
      <section className={'top_section'}>
        <div className={'container'}>
          <Row align={'middle'}>
            <Col lg={12} xs={24} className={'top_section__header'}>
              <h1>Parcels Delivery</h1>
              <h3>We will deliver your parcel fast and safety</h3>
            </Col>
            <Col className={'search_form_container'} lg={12} xs={24}>
              <h4>
                Find your parcel
                <span className='dot-elastic'></span>
              </h4>
              <Form form={form} onFinish={onFinish} className={'search_form column'}>
                <Row justify={'start'} wrap={false}>
                  <Form.Item name='search' noStyle={true}>
                    <Input placeholder={'Search'} />
                  </Form.Item>
                  <Button type={'primary'} htmlType={'submit'}>
                    Search
                  </Button>
                </Row>
                {searchError && <div className={'search_form__error'}>{searchError}</div>}
              </Form>
            </Col>
          </Row>
        </div>
      </section>
      <section className={'achievements'}>
        <div className={'container'}>
          <Row align={'middle'} justify={'space-between'} className={'achievements__cards'}>
            <Col md={6} xs={20} className={'card'}>
              <h4>Header</h4>
              <div className={'card__text'}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </Col>
            <Col md={6} xs={20} className={'card'}>
              <h4>Header</h4>
              <div className={'card__text'}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </Col>
            <Col md={6} xs={20} className={'card'}>
              <h4>Header</h4>
              <div className={'card__text'}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </div>
            </Col>
          </Row>
        </div>
      </section>
      <section className={'information'}>
        <div className={'container'}>
          <Row align={'top'}>
            <Col md={12} className={'about_img'}>
              <img src={parcel} />
            </Col>
            <Col md={12} className={'about_us'}>
              <h3>About our Company</h3>
              <div className={'about_us__text'}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>
      <section className={'faq_section'}>
        <div className={'container'}>
          <h3>FAQ</h3>
          <Row justify={'center'}>
            <Col md={16}>
              <FaqItem
                answer={
                  'flknsdklf sdfkjnsdklf sldfnlsd fl skdlf lskd fl sdlf ksd flk sdlfk sdlf ls dflk sdlf lskd flsk dflk sdlfk '
                }
                question={'how are you?'}
              />
              <FaqItem
                answer={
                  'flknsdklf sdfkjnsdklf sldfnlsd fl skdlf lskd fl sdlf ksd flk sdlfk sdlf ls dflk sdlf lskd flsk dflk sdlfk '
                }
                question={'how are you?'}
              />
              <FaqItem
                answer={
                  'flknsdklf sdfkjnsdklf sldfnlsd fl skdlf lskd fl sdlf ksd flk sdlfk sdlf ls dflk sdlf lskd flsk dflk sdlfk '
                }
                question={'how are you?'}
              />
              <FaqItem
                answer={
                  'flknsdklf sdfkjnsdklf sldfnlsd fl skdlf lskd fl sdlf ksd flk sdlfk sdlf ls dflk sdlf lskd flsk dflk sdlfk '
                }
                question={'how are you?'}
              />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  )
}
export default connector(Main)
