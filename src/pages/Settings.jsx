import { FiSettings, FiUser, FiBell, FiLock, FiGlobe } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function Settings() {
  const { user } = useAuth()

  return (
    <Layout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Settings
        </h2>
        <p style={{ color: 'var(--gray-600)' }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1" style={{ gap: '1.5rem', maxWidth: '800px' }}>
        {/* Profile Settings */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <FiUser />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                Profile Settings
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                Update your personal information
              </p>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={user?.username || ''} 
              disabled 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={user?.email || ''} 
              disabled 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={user?.full_name || ''} 
              disabled 
            />
          </div>
          <button className="btn btn-primary" disabled>
            Save Changes (Coming Soon)
          </button>
        </div>

        {/* Notifications */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: 'var(--success)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <FiBell />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                Notifications
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                Manage your notification preferences
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            Notification settings coming soon...
          </p>
        </div>

        {/* Security */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: 'var(--danger)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <FiLock />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                Security
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                Manage your password and security settings
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            Security settings coming soon...
          </p>
        </div>

        {/* Preferences */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: 'var(--info)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              <FiGlobe />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                Preferences
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                Customize your experience
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            Preference settings coming soon...
          </p>
        </div>
      </div>
    </Layout>
  )
}
