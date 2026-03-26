import React from 'react'
import LayoutNav from './components/topnav'
import LayoutHeader from './components/Header'
import LayoutFooter from './components/Footer'
import { Outlet } from 'react-router-dom'
import HeaderFix from './components/HeaderFix'

const Layout = () => {


  return (
    <>
      <HeaderFix />
      <LayoutNav />
      <LayoutHeader />
      <Outlet />
      <LayoutFooter />
    </>
  )

}

export default Layout