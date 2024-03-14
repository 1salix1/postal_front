import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { connect, ConnectedProps } from 'react-redux'
import { login } from '../../store/actions'
import { useNavigate } from 'react-router-dom'
const mapDispatchToProps = {
  login,
}
const connector = connect(null, mapDispatchToProps)

type LoginProps = ConnectedProps<typeof connector>

type loginForm = {
  login: string
  password: string
}

const Login: React.FC<LoginProps> = ({ login }) => {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const formSubmit = async (values: loginForm) => {
    setError('')
    if (!(await login(values.login, values.password))) {
      setError('Login or Password not Valid')
    }
    navigate('/parcels')
  }
  return (
    <div className={'login'}>
      <Form onFinish={formSubmit} className={'login_form'} labelCol={{ span: 6, offset: 0 }}>
        <Form.Item label={'Login'} name={'login'} rules={[{ required: true, message: 'Please input your login' }]}>
          <Input placeholder={'Login'} />
        </Form.Item>
        <Form.Item
          label={'Password'}
          name={'password'}
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input type={'password'} placeholder={'Password'} />
        </Form.Item>
        <Button type={'primary'} htmlType={'submit'}>
          Login
        </Button>
        {error && <div className={'login_form__error'}>{error}</div>}
      </Form>
    </div>
  )
}
export default connector(Login)
