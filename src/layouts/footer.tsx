import React, { useEffect } from 'react'
import { notification } from 'antd'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { setNotifications } from 'store/reducers/notificationHandler'

const Footer = () => {
  const dispatch = useAppDispatch()
  const [api, contextHolder] = notification.useNotification()
  const { alerts } = useAppSelector(state => state.notificationHandler)
  useEffect(() => {
    if (alerts.length > 0) {
      const alert = alerts[alerts.length - 1]
      dispatch(setNotifications(alerts.slice(0, alerts.length - 1)))
      api[alert.type]({
        message: alert.message,
      })
    }
  }, [alerts])

  return (
    <footer>
      {contextHolder}
      <div className={'footer__copyrights'}>2024 © Все права защищены</div>
    </footer>
  )
}
export default Footer
