import React, { useEffect } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Lenis from 'lenis'
import LayoutOne from './layout/LayoutOne'
import ProtectedRoute from './components/common/ProtectedRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import TrackOrder from './pages/TrackOrder'
import Profile from './pages/Profile'
import Lookbook from './pages/Lookbook'
import Journal from './pages/Journal'
import About from './pages/About'
import AuthLayout from './layout/AuthLayout'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import VerifyEmail from './pages/VerifyEmail'
import AdminLayout from './layout/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Analytics from './pages/admin/Analytics'
import Orders from './pages/admin/Orders'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Inventory from './pages/admin/Inventory'
import Customers from './pages/admin/Customers'
import Finances from './pages/admin/Finances'
import Marketing from './pages/admin/Marketing'
import Discounts from './pages/admin/Discounts'
import Agents from './pages/admin/Agents'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

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
          <Route path="shop" element={<Shop />} />
          <Route path="lookbook" element={<Lookbook />} />
          <Route path="journal" element={<Journal />} />
          <Route path="about" element={<About />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route
            path="my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ====== Auth (glass split-card, violet theme) ====== */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* ====== Admin (role-gated: admin / editor) ====== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'editor']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="finances" element={<Finances />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="agents" element={<Agents />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </>
    )
  )

  return <RouterProvider router={myRoute} />
}

export default App
