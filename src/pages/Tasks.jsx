import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FiCheckSquare, FiClock, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Tasks() {
  const { user } = useAuth()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/tasks')
      return response.data.tasks
    },
    enabled: !!user
  })

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: { class: 'badge-danger', icon: <FiAlertCircle /> },
      high: { class: 'badge-warning', icon: <FiClock /> },
      medium: { class: 'badge-primary', icon: <FiClock /> },
      low: { class: 'badge-success', icon: <FiClock /> }
    }
    return badges[priority] || badges.medium
  }

  const getStatusBadge = (status) => {
    const badges = {
      todo: 'badge-gray',
      in_progress: 'badge-primary',
      in_review: 'badge-warning',
      done: 'badge-success'
    }
    return badges[status] || 'badge-gray'
  }

  return (
    <Layout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          All Tasks
        </h2>
        <p style={{ color: 'var(--gray-600)' }}>
          View and manage all your tasks across projects
        </p>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : tasks?.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FiCheckSquare style={{ fontSize: '3rem', color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>No tasks yet</h3>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
            Create a project and add tasks to get started
          </p>
          <Link to="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {tasks?.map(task => {
            const priorityBadge = getPriorityBadge(task.priority)
            return (
              <div key={task.id} className={`task-card priority-${task.priority}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                      <span className={`badge ${priorityBadge.class}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {priorityBadge.icon}
                        {task.priority}
                      </span>
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.project_name && (
                        <Link 
                          to={`/projects/${task.project_id}`}
                          className="badge badge-primary"
                          style={{ textDecoration: 'none' }}
                        >
                          {task.project_name}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
