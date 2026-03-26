import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FiPlus, FiFolder, FiCheckSquare, FiClock, FiX, FiTrendingUp, FiZap, FiTarget, FiAward, FiCalendar, FiActivity } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects')
      return response.data.projects
    },
    enabled: !!user
  })

  const createProject = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/projects', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      setShowModal(false)
      setProjectName('')
      setProjectDesc('')
      toast.success('🎉 Project created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create project')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createProject.mutate({ name: projectName, description: projectDesc })
  }

  // Calculate unique metrics
  const totalTasks = projects?.reduce((sum, p) => sum + (p.task_count || 0), 0) || 0
  const activeProjects = projects?.filter(p => !p.is_archived).length || 0
  const completionRate = totalTasks > 0 ? Math.round((totalTasks * 0.65)) : 0 // Mock completion
  const todayTasks = Math.floor(totalTasks * 0.3) // Mock today's tasks

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '🌅 Good Morning'
    if (hour < 18) return '☀️ Good Afternoon'
    return '🌙 Good Evening'
  }

  // Mock productivity data
  const productivityScore = 87
  const weeklyProgress = 65

  return (
    <Layout>
      {/* Hero Section with Greeting */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {getGreeting()}, {user?.username}! 👋
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '1.5rem' }}>
            You have {todayTasks} tasks due today. Let's make it productive!
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowModal(true)} className="btn" style={{
              background: 'white',
              color: '#667eea',
              fontWeight: '600'
            }}>
              <FiPlus /> New Project
            </button>
            <Link to="/tasks" className="btn" style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              textDecoration: 'none'
            }}>
              <FiCheckSquare /> View All Tasks
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          right: '100px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 0
        }}></div>
      </div>

      {/* Unique Stats Cards with Animations */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        {/* Productivity Score */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Productivity Score</div>
              <FiZap size={24} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {productivityScore}%
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              <FiTrendingUp style={{ display: 'inline', marginRight: '0.25rem' }} />
              +12% from last week
            </div>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)'
          }}></div>
        </div>

        {/* Active Projects */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Active Projects</div>
            <FiFolder size={24} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {activeProjects}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            {projects?.length || 0} total projects
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Tasks Completed</div>
            <FiCheckSquare size={24} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {completionRate}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            {totalTasks} total tasks
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Weekly Progress</div>
            <FiTarget size={24} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {weeklyProgress}%
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
            <FiActivity style={{ display: 'inline', marginRight: '0.25rem' }} />
            On track for goals
          </div>
        </div>
      </div>

      {/* Quick Actions & Insights Row */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        {/* Today's Focus */}
        <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              background: '#ffc107',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiCalendar size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#856404' }}>Today's Focus</div>
              <div style={{ fontSize: '0.75rem', color: '#856404', opacity: 0.8 }}>
                {todayTasks} tasks due today
              </div>
            </div>
          </div>
          <Link to="/tasks" className="btn btn-sm" style={{
            background: '#ffc107',
            color: 'white',
            width: '100%',
            justifyContent: 'center'
          }}>
            View Tasks
          </Link>
        </div>

        {/* Achievement */}
        <div className="card" style={{ background: '#d1ecf1', border: '2px solid #17a2b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              background: '#17a2b8',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiAward size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#0c5460' }}>Achievement</div>
              <div style={{ fontSize: '0.75rem', color: '#0c5460', opacity: 0.8 }}>
                5 day streak! 🔥
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#0c5460' }}>
            Keep up the great work!
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card" style={{ background: '#f8d7da', border: '2px solid #dc3545' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              background: '#dc3545',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiClock size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#721c24' }}>Overdue</div>
              <div style={{ fontSize: '0.75rem', color: '#721c24', opacity: 0.8 }}>
                2 tasks need attention
              </div>
            </div>
          </div>
          <Link to="/tasks" className="btn btn-sm" style={{
            background: '#dc3545',
            color: 'white',
            width: '100%',
            justifyContent: 'center'
          }}>
            Review Now
          </Link>
        </div>
      </div>

      {/* Projects Section with Enhanced Cards */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
            Your Projects
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            Manage and track your project progress
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <FiPlus /> New Project
        </button>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : projects?.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'white',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <FiFolder style={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>Start Your First Project</h3>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            Create a project to organize your tasks and boost your productivity
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-lg">
            <FiPlus /> Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {projects?.map((project, index) => {
            const gradients = [
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            ]
            const gradient = gradients[index % gradients.length]
            
            return (
              <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  border: 'none',
                  transition: 'all 0.3s'
                }}>
                  {/* Gradient Header */}
                  <div style={{
                    background: gradient,
                    height: '100px',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2.5rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <FiFolder />
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)'
                    }}></div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
                    {project.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1rem', minHeight: '40px' }}>
                    {project.description || 'No description provided'}
                  </p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>Progress</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)' }}>
                        {project.task_count > 0 ? Math.round((project.task_count * 0.6)) : 0}%
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: 'var(--gray-200)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: gradient,
                        width: `${project.task_count > 0 ? Math.round((project.task_count * 0.6)) : 0}%`,
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                    <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FiCheckSquare size={14} />
                      {project.task_count} tasks
                    </span>
                    {project.is_archived && (
                      <span className="badge badge-gray">Archived</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Project</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Enter project description (optional)"
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createProject.isPending}>
                  {createProject.isPending ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
