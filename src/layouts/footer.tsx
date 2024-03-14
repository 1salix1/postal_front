import React, { useEffect } from 'react'
import { notification } from 'antd'
import { RootState } from '../store/store'
import { resetError } from '../store/actions'
import { connect, ConnectedProps } from 'react-redux'
const mapStateToProps = (state: RootState) => ({
  error: state.errorHandler.error,
})
const mapDispatchToProps = {
  resetError,
}
const connector = connect(mapStateToProps, mapDispatchToProps)
type FooterProps = ConnectedProps<typeof connector>
const Footer = ({ error, resetError }: FooterProps) => {
  const [api, contextHolder] = notification.useNotification()
  useEffect(() => {
    error &&
      api['error']({
        message: 'Error',
        description: error,
        placement: 'bottomLeft',
        duration: 4,
      })
    resetError()
  }, [error])
  return (
    <footer>
      {contextHolder}
      <div className={'footer__links'}>
        <div>Terms Conditions</div>
        <div>Policy</div>
        <div>Contact Us</div>
      </div>
      <div className={'footer__copyrights'}>2024 © All rights received</div>
    </footer>
  )
}
export default connector(Footer)
