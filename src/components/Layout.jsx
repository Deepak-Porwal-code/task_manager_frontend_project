import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  FiHome, 
  FiFolder, 
  FiCheckSquare, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/projects', icon: FiFolder, label: 'Projects' },
    { path: '/tasks', icon: FiCheckSquare, label: 'All Tasks' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const getUserInitials = () => {
    if (!user) return '?'
    return user.username?.charAt(0).toUpperCase() || '?'
  }

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileMenuOpen(!mobileMenuOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside 
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'open' : ''}`}
        id="main-sidebar"
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiCheckSquare />
            <span>TaskManager</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.username || 'User'}</div>
              <div className="user-email">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="nav-item"
            style={{ width: '100%', marginTop: '0.5rem', border: 'none', background: 'none' }}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-overlay show"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="menu-toggle"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
              {sidebarCollapsed || mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div className="page-header">
              <h1 className="page-title">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
              Welcome, {user?.username}
            </span>
          </div>
        </div>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  )
}
