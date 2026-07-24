import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { FlyToCartProvider } from './context/FlyToCartContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <FlyToCartProvider>
            <App />
            <Toaster
              position="top-center"
              toastOptions={{
                style: { background: '#1a1a1a', color: '#EDE6DA', border: '1px solid #2a2a2a', fontSize: '13px' },
              }}
            />
          </FlyToCartProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>
)
