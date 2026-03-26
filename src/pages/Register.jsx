import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiCheckSquare, FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register(formData)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', fontSize: '0.875rem' }}>
            Sign up to start managing your projects
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                Username
              </label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiMail style={{ display: 'inline', marginRight: '0.5rem' }} />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                className="form-input"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name (optional)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                required
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading} 
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <FiUserPlus />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--primary)', 
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
