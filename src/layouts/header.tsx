import React from 'react'
import logo from '../assets/images/logo.png'
import { RootState } from '../store/store'
import { connect, ConnectedProps } from 'react-redux'
import { Link } from 'react-router-dom'
const mapStateToProps = (state: RootState) => ({
  name: state.userReducer.name,
})
const connector = connect(mapStateToProps, null)

type HeaderProps = ConnectedProps<typeof connector>
const Header = ({ name }: HeaderProps) => {
  return (
    <header>
      <div className={'container'}>
        <Link className={'logo'} to={'/'}>
          <img src={logo} />
        </Link>
        <ul className={'menu-nav'}>
          <li>
            <Link to={'/'}>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to={'/about'}>
              <span>About Us</span>
            </Link>
          </li>
          <li>
            <Link to={'/track'}>
              <span>Tracking</span>
            </Link>
          </li>
        </ul>
        {name && <div className={'user'}>Hello, {name}</div>}
      </div>
    </header>
  )
}
export default connector(Header)
