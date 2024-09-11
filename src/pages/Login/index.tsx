import React, { useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { login } from 'store/reducers/userReducer'
import { addNotification } from 'store/reducers/notificationHandler'

type loginForm = {
  login: string
  password: string
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const { error, loading } = useAppSelector(state => state.userReducer)
  const navigate = useNavigate()
  const formSubmit = async (values: loginForm) => {
    dispatch(login(values)).then(response => {
      if (response.payload?.name) {
        navigate('/parcels')
      }
    })
  }
  useEffect(() => {
    if (!loading && error) {
      dispatch(addNotification({ message: error, type: 'error' }))
    }
  }, [error, loading])

  return (
    <div className={'login'}>
      <Form onFinish={formSubmit} className={'login_form'} labelCol={{ span: 6, offset: 0 }}>
        <Form.Item label={'Логин'} name={'login'} rules={[{ required: true, message: 'Введите логин' }]}>
          <Input placeholder={'Логин'} />
        </Form.Item>
        <Form.Item label={'Пароль'} name={'password'} rules={[{ required: true, message: 'Введите пароль' }]}>
          <Input type={'password'} placeholder={'Пароль'} />
        </Form.Item>
        <Button type={'primary'} htmlType={'submit'} loading={loading}>
          Войти
        </Button>
        {error && <div className={'login_form__error'}>{error}</div>}
      </Form>
    </div>
  )
}
export default Login
