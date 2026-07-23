import React, { useEffect } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Lenis from 'lenis'
import LayoutOne from './layout/LayoutOne'
import Home from './pages/Home'

const App = () => {
  // ====== Initialize AOS & Lenis Smooth Scroll
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    })

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const myRoute = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* ====== Public ====== */}
        <Route path="/" element={<LayoutOne />}>
          <Route index element={<Home />} />
        </Route>
      </>
    )
  )

  return <RouterProvider router={myRoute} />
}

export default App
