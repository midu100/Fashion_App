import React from 'react'
import { Outlet } from 'react-router'

// ====== Auth shell — KAZIR NATION dark theme with gold ambient blobs ======
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-dark">
      {/* Ambient floating gold/warm blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[140px] pointer-events-none opacity-25" style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[140px] pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, #A8894E 0%, transparent 70%)' }} />
      <div className="absolute top-[30%] right-[12%] w-[25%] h-[25%] rounded-full blur-[110px] pointer-events-none opacity-15" style={{ background: 'radial-gradient(circle, #D4BA85 0%, transparent 70%)' }} />

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 relative z-10">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
