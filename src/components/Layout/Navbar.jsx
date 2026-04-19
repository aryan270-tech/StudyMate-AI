// src/components/Layout/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { logOut } from '../../services/authService'
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BarChart2,
  LogOut,
  Zap,
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/planner',   label: 'Planner',   icon: CalendarDays },
  { to: '/tasks',     label: 'Tasks',     icon: CheckSquare },
  { to: '/progress',  label: 'Progress',  icon: BarChart2 },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logOut()
    navigate('/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-ink-900 border-r border-ink-800 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6 border-b border-ink-800">
          <div className="w-8 h-8 bg-acid rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-ink-950" fill="currentColor" />
          </div>
          <span className="font-display font-700 text-ink-50 text-lg leading-none">
            StudyMate
          </span>
        </div>

        {/* User chip */}
        <div className="px-4 py-4 border-b border-ink-800">
          <div className="flex items-center gap-2.5 bg-ink-800 rounded-xl px-3 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-acid/20 flex items-center justify-center flex-shrink-0">
              <span className="text-acid font-display font-700 text-xs">
                {user?.displayName?.[0]?.toUpperCase() || 'S'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-display font-600 text-ink-100 truncate">
                {user?.displayName || 'Student'}
              </p>
              <p className="text-xs text-ink-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-500 transition-all duration-200 group ${
                  active
                    ? 'bg-acid text-ink-950'
                    : 'text-ink-400 hover:text-ink-100 hover:bg-ink-800'
                }`}
              >
                <Icon size={16} className={active ? 'text-ink-950' : 'text-ink-500 group-hover:text-ink-300'} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-ink-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-display font-500 text-ink-500 hover:text-coral hover:bg-coral/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ink-900 border-t border-ink-800 z-40 flex">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-display transition-colors ${
                active ? 'text-acid' : 'text-ink-500'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
