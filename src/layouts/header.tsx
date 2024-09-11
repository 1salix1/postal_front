import React from 'react'
import logo from '../assets/images/logo2.png'
import { RootState } from '../store/store'
import { connect, ConnectedProps } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from 'hooks/redux'
import { logout } from 'store/reducers/userReducer'
const mapStateToProps = (state: RootState) => ({
  name: state.userReducer.name,
})
const connector = connect(mapStateToProps, null)

type HeaderProps = ConnectedProps<typeof connector>
const Header = ({ name }: HeaderProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const exit = () => {
    dispatch(logout()).then(response => {
      navigate('/')
    })
  }
  return (
    <header>
      <div className={'container'}>
        <Link className={'logo'} to={'/'}>
          <img src={logo} />
        </Link>
        {name && (
          <>
            <div className={'user'}>
              Привет, {name}
              <a onClick={() => exit()} className={'exit'}>
                Выйти
              </a>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
export default connector(Header)
