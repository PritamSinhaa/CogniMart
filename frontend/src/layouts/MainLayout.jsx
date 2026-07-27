import Navbar from '@/components/layout/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <footer>Footer</footer>
    </>
  )
}

export default MainLayout
