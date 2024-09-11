import React, { ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Header, Footer } from './layouts'
import { ConfigProvider, Spin } from 'antd'
import Main from './pages/Main'

import { Provider } from 'react-redux'
import store from './store/store'
import ParcelTracking from './pages/Tracking'
import Parcels from './pages/Parcels'
import Login from './pages/Login'
import Parcel from './pages/Parcel'
import ru_RU from 'antd/lib/locale/ru_RU'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { getUser } from 'store/reducers/userReducer'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch()
  const { name } = useAppSelector(state => state.userReducer)
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])
  if (!name) return null
  return (
    <div className={'admin_panel'}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

const prepareLayout = (page: ReactNode) => {
  return (
    <>
      <Header />
      <main>{page}</main>
      <Footer />
    </>
  )
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: prepareLayout(<Main />),
    },
    {
      path: '/track',
      element: prepareLayout(<ParcelTracking />),
    },
    {
      path: '/track/:trackNumber',
      element: prepareLayout(<ParcelTracking />),
    },
    {
      path: '/parcels',
      element: (
        <PrivateRoute>
          <Parcels />
        </PrivateRoute>
      ),
    },
    {
      path: '/parcel',
      element: (
        <PrivateRoute>
          <Parcel />
        </PrivateRoute>
      ),
    },
    {
      path: '/login',
      element: prepareLayout(<Login />),
    },
  ],
  { basename: '/' },
)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: '1e6a94',
            fontFamily: 'Roboto, sans-serif',
            fontSize: 16,
          },
          components: {
            Form: {
              itemMarginBottom: 10,
              labelHeight: 20,
              verticalLabelPadding: '0 0 4px',
            },
          },
        }}
        locale={ru_RU}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
