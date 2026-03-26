import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiPlus, FiX, FiTrash2, FiEdit2, FiClock, FiAlertCircle, FiPlay, FiPause, FiCheck, FiTag, FiFileText, FiCalendar, FiZap } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ProjectDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [activeTimer, setActiveTimer] = useState(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    estimated_time: '',
    due_date: '',
    tags: [],
    notes: ''
  })
  const [newTag, setNewTag] = useState('')

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await api.get(`/projects/${id}`)
      return response.data
    },
    enabled: !!user
  })

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer])

  const createTask = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/tasks', { ...data, project_id: parseInt(id) })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id])
      handleCloseModal()
      toast.success('✅ Task created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create task')
    }
  })

  const updateTask = useMutation({
    mutationFn: async ({ taskId, data }) => {
      const response = await api.put(`/tasks/${taskId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id])
      setEditingTask(null)
      toast.success('✅ Task updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update task')
    }
  })

  const deleteTask = useMutation({
    mutationFn: async (taskId) => {
      await api.delete(`/tasks/${taskId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id])
      toast.success('🗑️ Task deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete task')
    }
  })

  const addTimeToTask = useMutation({
    mutationFn: async ({ taskId, minutes }) => {
      const response = await api.post(`/tasks/${taskId}/time`, { minutes })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id])
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...taskData,
      estimated_time: taskData.estimated_time ? parseInt(taskData.estimated_time) : null,
      tags: taskData.tags
    }
    
    if (editingTask) {
      updateTask.mutate({ taskId: editingTask.id, data: submitData })
    } else {
      createTask.mutate(submitData)
    }
  }

  const handleStatusChange = (taskId, newStatus) => {
    updateTask.mutate({ taskId, data: { status: newStatus } })
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setTaskData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      estimated_time: task.estimated_time || '',
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
      tags: task.tags || [],
      notes: task.notes || ''
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTask(null)
    setTaskData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      estimated_time: '',
      due_date: '',
      tags: [],
      notes: ''
    })
    setNewTag('')
  }

  const startTimer = (taskId) => {
    setActiveTimer(taskId)
    setTimerSeconds(0)
    toast.success('⏱️ Timer started!')
  }

  const stopTimer = (taskId) => {
    const minutes = Math.floor(timerSeconds / 60)
    if (minutes > 0) {
      addTimeToTask.mutate({ taskId, minutes })
      toast.success(`✅ ${minutes} minutes logged!`)
    }
    setActiveTimer(null)
    setTimerSeconds(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const addTag = () => {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      setTaskData({ ...taskData, tags: [...taskData.tags, newTag.trim()] })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTaskData({ ...taskData, tags: taskData.tags.filter(tag => tag !== tagToRemove) })
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: { class: 'badge-danger', icon: <FiAlertCircle /> },
      high: { class: 'badge-warning', icon: <FiClock /> },
      medium: { class: 'badge-primary', icon: <FiClock /> },
      low: { class: 'badge-success', icon: <FiClock /> }
    }
    return badges[priority] || badges.medium
  }

  const statusColumns = [
    { id: 'todo', label: 'To Do', color: 'var(--gray-400)' },
    { id: 'in_progress', label: 'In Progress', color: 'var(--info)' },
    { id: 'in_review', label: 'In Review', color: 'var(--warning)' },
    { id: 'done', label: 'Done', color: 'var(--success)' }
  ]

  const tagColors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#30cfd0', '#ffc107', '#ff6b6b']

  if (isLoading) {
    return (
      <Layout>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Project Header */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {project.name}
            </h2>
            <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
              {project.description || 'No description provided'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                📊 {project.tasks?.length || 0} Total Tasks
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                ✅ {project.tasks?.filter(t => t.status === 'done').length || 0} Completed
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                ⏱️ {project.tasks?.reduce((sum, t) => sum + (t.actual_time || 0), 0)} min tracked
              </span>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn" style={{ background: 'white', color: '#667eea' }}>
            <FiPlus /> New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {statusColumns.map(column => {
          const tasks = project.tasks?.filter(t => t.status === column.id) || []
          return (
            <div key={column.id} className="kanban-column">
              <div className="kanban-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: column.color
                  }}></div>
                  <span className="kanban-title">{column.label}</span>
                </div>
                <span className="kanban-count">{tasks.length}</span>
              </div>

              <div>
                {tasks.map(task => {
                  const priorityBadge = getPriorityBadge(task.priority)
                  const isTimerActive = activeTimer === task.id
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
                  
                  return (
                    <div key={task.id} className={`task-card priority-${task.priority}`} style={{
                      border: isOverdue ? '2px solid var(--danger)' : undefined
                    }}>
                      {/* Task Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 className="task-title" style={{ flex: 1 }}>{task.title}</h4>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            onClick={() => handleEditTask(task)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--gray-400)',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'var(--gray-100)'
                              e.currentTarget.style.color = 'var(--primary)'
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'none'
                              e.currentTarget.style.color = 'var(--gray-400)'
                            }}
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this task?')) {
                                deleteTask.mutate(task.id)
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--gray-400)',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'var(--danger)'
                              e.currentTarget.style.color = 'white'
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'none'
                              e.currentTarget.style.color = 'var(--gray-400)'
                            }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                          {task.tags.map((tag, idx) => (
                            <span key={idx} style={{
                              background: tagColors[idx % tagColors.length],
                              color: 'white',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: '500'
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Time & Due Date */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                        {task.estimated_time && (
                          <span title="Estimated time">
                            <FiZap size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                            {task.estimated_time}m
                          </span>
                        )}
                        {task.actual_time > 0 && (
                          <span title="Time tracked">
                            <FiClock size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                            {task.actual_time}m
                          </span>
                        )}
                        {task.due_date && (
                          <span title="Due date" style={{ color: isOverdue ? 'var(--danger)' : undefined }}>
                            <FiCalendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Pomodoro Timer */}
                      {isTimerActive && (
                        <div style={{
                          background: 'var(--primary)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          marginBottom: '0.75rem',
                          textAlign: 'center',
                          fontWeight: '600'
                        }}>
                          ⏱️ {formatTime(timerSeconds)}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                        <span className={`badge ${priorityBadge.class}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {priorityBadge.icon}
                          {task.priority}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {!isTimerActive ? (
                            <button
                              onClick={() => startTimer(task.id)}
                              className="btn btn-sm btn-success"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              <FiPlay size={12} />
                            </button>
                          ) : (
                            <button
                              onClick={() => stopTimer(task.id)}
                              className="btn btn-sm btn-danger"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              <FiPause size={12} />
                            </button>
                          )}
                          
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className="form-select"
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              width: 'auto',
                              minWidth: '100px'
                            }}
                          >
                            {statusColumns.map(col => (
                              <option key={col.id} value={col.id}>
                                {col.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {tasks.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    color: 'var(--gray-400)',
                    fontSize: '0.875rem'
                  }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create/Edit Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={taskData.description}
                  onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                  placeholder="Enter task description (optional)"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={taskData.priority}
                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={taskData.status}
                    onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                  >
                    {statusColumns.map(col => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">
                    <FiZap style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={taskData.estimated_time}
                    onChange={(e) => setTaskData({ ...taskData, estimated_time: e.target.value })}
                    placeholder="e.g., 30"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FiCalendar style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={taskData.due_date}
                    onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiTag style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Tags
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag and press Enter"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addTag} className="btn btn-secondary">
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {taskData.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      background: tagColors[idx % tagColors.length],
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiFileText style={{ display: 'inline', marginRight: '0.25rem' }} />
                  Notes
                </label>
                <textarea
                  className="form-textarea"
                  value={taskData.notes}
                  onChange={(e) => setTaskData({ ...taskData, notes: e.target.value })}
                  placeholder="Add detailed notes (optional)"
                  rows="4"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={createTask.isPending || updateTask.isPending}
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
