import React, { createContext, useContext, useState, useEffect } from 'react'
import { authServices } from '../api'
import { getCookie, deleteCookie } from '../components/common/Services'

// ====== Auth Context (store-less; restores session from the X_AS-TOKEN cookie) ======
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ====== Restore the session on first load (only if a token cookie exists)
  useEffect(() => {
    const restore = async () => {
      if (!getCookie('X_AS-TOKEN')) {
        setLoading(false)
        return
      }
      try {
        const res = await authServices.getProfile()
        setUser(res?.user || null)
      } catch (error) {
        console.log(error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  // ====== Set after a successful sign in
  const login = (userData) => setUser(userData)

  // ====== Merge updated fields (e.g. after a profile / avatar update)
  const updateUser = (userData) => setUser((prev) => ({ ...prev, ...userData }))

  // ====== Clear session (cookies + state)
  const logout = async () => {
    try {
      await authServices.logout()
    } catch (error) {
      console.log(error)
    }
    deleteCookie('X_AS-TOKEN')
    deleteCookie('R_FS-TOKEN')
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'editor',
    login,
    updateUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ====== Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
