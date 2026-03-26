import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiCheckSquare, FiUser, FiLock, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(username, password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '0.5rem'
          }}>
            <FiCheckSquare />
            <span>TaskManager</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>
            Manage your projects efficiently
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', fontSize: '0.875rem' }}>
            Sign in to continue to your dashboard
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                Username
              </label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                Password
              </label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading} 
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <FiLogIn />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--primary)', 
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--gray-50)',
            borderRadius: '0.5rem',
            border: '1px solid var(--gray-200)'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
              Demo Credentials:
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
              Username: <code style={{ background: 'white', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>demo</code>
              <br />
              Password: <code style={{ background: 'white', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>demo123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
