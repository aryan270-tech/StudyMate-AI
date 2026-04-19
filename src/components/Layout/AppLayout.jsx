// src/components/Layout/AppLayout.jsx
import Navbar from './Navbar'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      {/* Offset for sidebar on desktop, bottom nav on mobile */}
      <main className="md:ml-56 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
