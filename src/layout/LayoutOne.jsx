import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LayoutOne = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-dark overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default LayoutOne
