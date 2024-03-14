import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Header, Footer } from './layouts'
import { ConfigProvider } from 'antd'
import Main from './pages/Main'

import { connect, ConnectedProps, Provider } from 'react-redux'
import store, { RootState } from './store/store'
import ParcelTracking from './pages/Tracking'
import Parcels from './pages/Parcels'
import Login from './pages/Login'
import Parcel from './pages/Parcel'
import { getUser } from './store/actions'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const mapStateToProps = (state: RootState) => ({
  userName: state.userReducer.name,
})
const mapDispatchToProps = {
  getUser,
}
const connector = connect(mapStateToProps, mapDispatchToProps)

type PrivateRouteProps = ConnectedProps<typeof connector> & { children: JSX.Element }

const PrivateRoute = ({ getUser, userName, children }: PrivateRouteProps) => {
  getUser()
  console.log('render Private route')
  if (!userName) return null
  return children
}
const ConnectedPrivateRoute = connector(PrivateRoute)

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
      children: [
        {
          path: ':trackNumber',
          element: prepareLayout(<ParcelTracking />),
        },
      ],
    },
    {
      path: '/parcels',
      element: prepareLayout(
        <ConnectedPrivateRoute>
          <Parcels />
        </ConnectedPrivateRoute>,
      ),
    },
    {
      path: '/parcel',
      element: prepareLayout(
        <ConnectedPrivateRoute>
          <Parcel />
        </ConnectedPrivateRoute>,
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
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
